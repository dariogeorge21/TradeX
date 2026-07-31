import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { cache30s } from "@/lib/ttl-cache";
import { getMutualFundBundle } from "@/services/mutual-fund-research";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9.\-_]+$/)
    .transform((s) => s.toUpperCase()),
});

const SYSTEM_PROMPT = `You are a legendary Wall Street Mutual Fund Analyst and Portfolio Manager. Your expertise spans Fund Performance, Risk Analysis, Asset Allocation, Expense Ratios, and Macroeconomics.

Your goal is to provide a highly actionable, accurate, and structured mutual fund research note. Your analysis must directly help users choose whether to invest in or avoid this fund, and clearly forecast if the fund is a solid long-term hold or currently underperforming.

Strict Directives:
1. Never hallucinate or invent numbers. Only use the provided financial data.
2. If data is missing, clearly state it.
3. Be definitive but balanced. State clear opinions on Buy/Hold/Avoid decisions and explain the logic.
4. Output format: structured markdown with headings, bold text, and bullet points.

You MUST include the following sections exactly:
- **Executive Summary**: A punchy 2-sentence overview.
- **Fund Assessment**: State definitively whether the fund is a **Buy**, **Hold**, or **Avoid** based on current data.
- **Key Performance Indicators (KPIs)**: List 3 to 5 critical KPIs for this fund (e.g., Expense Ratio, YTD Return, Sharpe Ratio, Top Sector) based on the supplied data, and explain why they matter right now.
- **Risk & Composition Breakdown**: What is the data actually saying about how the fund is allocated and its volatility vs category?
- **Bullish Catalysts vs. Bearish Risks**: Weigh the upside (e.g., strong category performance, low fees) against the downside (e.g., high turnover, lagging returns).
- **Final Recommendation**: You MUST include these lines EXACTLY:
  - Recommendation: Strong Buy | Buy | Hold | Avoid | Strong Avoid
  - Confidence Score (0-100): [Score]
  - Investment Horizon: Short | Medium | Long
  - Risk Level: Low | Medium | High
  - Important Disclaimer: [Standard disclaimer]`;

function buildGroqUserInput(bundle: any): string {
  const payload = {
    generatedAt: bundle.asOfIso,
    symbol: bundle.symbol,
    summary: bundle.data?.summary,
    performance: bundle.data?.performance,
    risk: bundle.data?.risk,
    ratings: bundle.data?.ratings,
    composition: bundle.data?.composition,
    purchase_info: bundle.data?.purchase_info,
    sustainability: bundle.data?.sustainability,
    recentNews: bundle.news.slice(0, 10).map((n: any) => ({
      headline: n.headline,
      source: n.source,
      datetimeUnixSeconds: n.datetimeUnixSeconds,
    })),
    dataGaps: bundle.providerErrors,
  };

  return `Generate an institutional-grade mutual fund research note for the fund below, adhering to the requested sections.

DATA (JSON):
${JSON.stringify(payload)}`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rawParams = await ctx.params;
  const parsedParams = ParamsSchema.safeParse(rawParams);
  if (!parsedParams.success) {
    return new Response("Invalid symbol.", { status: 400 });
  }

  const rl = rateLimit({
    key: `mf-ai-summary:${ip}:${parsedParams.data.symbol}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return new Response("Rate limit exceeded.", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
      },
    });
  }

  const cacheKey = `mf-ai-summary:${parsedParams.data.symbol}`;
  const cached = cache30s.get<string>(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    // Build a bundle — either from URL query params (fast path)
    // or from the service (fallback for direct URL access)
    let bundle: any;

    const name = req.nextUrl.searchParams.get("name");
    if (name) {
      // Fast path: metadata encoded by search bar
      const fund_family = req.nextUrl.searchParams.get("fund_family") ?? "";
      const fund_type = req.nextUrl.searchParams.get("fund_type") ?? "";
      const currency = req.nextUrl.searchParams.get("currency") ?? "";
      const exchange = req.nextUrl.searchParams.get("exchange") ?? "";
      const performance_rating = parseFloat(req.nextUrl.searchParams.get("performance_rating") ?? "0") || null;
      const risk_rating = parseFloat(req.nextUrl.searchParams.get("risk_rating") ?? "0") || null;

      bundle = {
        symbol: parsedParams.data.symbol,
        asOfIso: new Date().toISOString(),
        data: {
          summary: {
            symbol: parsedParams.data.symbol,
            name,
            fund_family,
            fund_type,
            currency,
            exchange,
            share_class_inception_date: "",
            ytd_return: 0,
            expense_ratio_net: 0,
            yield: 0,
            nav: 0,
            min_investment: 0,
            turnover_rate: 0,
            net_assets: 0,
            overview: "",
            people: [],
          },
          performance: null,
          risk: null,
          ratings: (performance_rating || risk_rating) ? {
            performance_rating: performance_rating ?? 0,
            risk_rating: risk_rating ?? 0,
            return_rating: 0,
          } : null,
          composition: null,
          purchase_info: null,
          sustainability: null,
        },
        news: [],
        providerErrors: [],
      };
    } else {
      // Fallback: try the service (may not find the symbol if not in paginated list)
      bundle = await getMutualFundBundle(parsedParams.data.symbol);
    }

    const userInput = buildGroqUserInput(bundle);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("GROQ API key not configured", { status: 500 });
    }

    let groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userInput },
        ],
        stream: true,
        temperature: 0.2,
      }),
    });

    if (groqRes.status === 429) {
      console.warn(`[MF AI Summary] Rate limited on versatile model for ${parsedParams.data.symbol}, falling back to instant...`);
      groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userInput },
          ],
          stream: true,
          temperature: 0.2,
        }),
      });
    }

    if (!groqRes.ok || !groqRes.body) {
      const errorText = await groqRes.text().catch(() => "");
      throw new Error(`Groq API error: ${groqRes.status} ${errorText}`);
    }

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let full = "";

    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
                try {
                  const data = JSON.parse(trimmed.slice(6));
                  if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                    const text = data.choices[0].delta.content;
                    full += text;
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // ignore JSON parse error for partial lines
                }
              }
            }
          }
          cache30s.set(cacheKey, full, 30_000);
          controller.close();
        } catch (e) {
          controller.error(e);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(out, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Cache": "MISS",
      },
    });
  } catch (err: any) {
    console.error(`[MF AI Summary] Error generating summary for ${parsedParams.data.symbol}:`, err);
    return new Response("Failed to generate AI summary.", { status: 502 });
  }
}
