import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { cache30s } from "@/lib/ttl-cache";
import { getStockResearchBundle } from "@/services/stock-research";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9.\-]+$/)
    .transform((s) => s.toUpperCase()),
});

const SYSTEM_PROMPT = `You are a legendary Wall Street Equity Analyst and Algorithmic Trader. Your expertise spans Fundamental Analysis, Technical Indicators, Macroeconomics, Market Psychology, and Risk Management.

Your goal is to provide a highly actionable, accurate, and structured equity research note. Your analysis must directly help users choose whether to buy or sell, and clearly forecast if the trend is Bullish or Bearish.

Strict Directives:
1. Never hallucinate or invent numbers. Only use the provided financial data.
2. If data is missing, clearly state it.
3. Be definitive but balanced. State clear opinions on Buy/Sell decisions and explain the logic.
4. Output format: structured markdown with headings, bold text, and bullet points.

You MUST include the following sections exactly:
- **Executive Summary**: A punchy 2-sentence overview.
- **Trend Prediction**: State definitively whether the short-to-medium term trend is **Bullish**, **Bearish**, or **Neutral**.
- **Key Performance Indicators (KPIs)**: List 3 to 5 critical KPIs for this stock (e.g., P/E ratio, RSI, revenue growth) based on the supplied data, and explain why they matter right now.
- **Fundamental & Technical Breakdown**: What is the data actually saying?
- **Bullish Catalysts vs. Bearish Risks**: Weigh the upside against the downside.
- **Final Recommendation**: You MUST include these lines EXACTLY:
  - Recommendation: Strong Buy | Buy | Hold | Sell | Strong Sell
  - Confidence Score (0-100): [Score]
  - Investment Horizon: Short | Medium | Long
  - Risk Level: Low | Medium | High
  - Important Disclaimer: [Standard disclaimer]`;

function buildGroqUserInput(bundle: any): string {
  const payload = {
    generatedAt: bundle.asOfIso,
    symbol: bundle.symbol,
    company: bundle.profile,
    fundamentals: bundle.fundamentals,
    quote: bundle.quote,
    metrics: bundle.metrics,
    recommendations: bundle.recommendations,
    technicals: bundle.technicals,
    recentNews: bundle.news.slice(0, 10).map((n: any) => ({
      headline: n.headline,
      source: n.source,
      datetimeUnixSeconds: n.datetimeUnixSeconds,
    })),
    priceHistoryDaily: bundle.historicalDaily.slice(-90),
    dataGaps: bundle.providerErrors,
  };

  return `Generate an institutional-grade equity research note for the company below, adhering to the requested sections.

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
    key: `ai-summary:${ip}:${parsedParams.data.symbol}`,
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

  const cacheKey = `ai-summary:${parsedParams.data.symbol}`;
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
    const bundle = await getStockResearchBundle(parsedParams.data.symbol);
    const userInput = buildGroqUserInput(bundle);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("GROQ API key not configured", { status: 500 });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    if (!groqRes.ok || !groqRes.body) {
      throw new Error(`Groq API error: ${groqRes.status}`);
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
    console.error(`[AI Summary] Error generating summary for ${parsedParams.data.symbol}:`, err);
    return new Response("Failed to generate AI summary.", { status: 502 });
  }
}
