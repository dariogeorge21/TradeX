import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { cache30s } from "@/lib/ttl-cache";
import { getCryptoResearchBundle } from "@/services/crypto-research";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9.\-:]+$/)
    .transform((s) => s.toUpperCase()),
});

const SYSTEM_PROMPT = `You are an elite Cryptocurrency Analyst and Algorithmic Trader. Your expertise spans on-chain analytics, Technical Indicators, macroeconomic correlations, and Market Psychology.

Your goal is to provide a highly actionable, accurate, and structured crypto research note. Your analysis must directly help users choose whether to buy, hold, or sell, and clearly forecast if the trend is Bullish or Bearish.

Strict Directives:
1. Never hallucinate or invent numbers. Only use the provided financial data.
2. If data is missing, clearly state it.
3. Be definitive but balanced. State clear opinions on Buy/Sell decisions and explain the logic.
4. Output format: structured markdown with headings, bold text, and bullet points.

You MUST include the following sections exactly:
- **Executive Summary**: A punchy 2-sentence overview.
- **Trend Prediction**: State definitively whether the short-to-medium term trend is **Bullish**, **Bearish**, or **Neutral**.
- **Technical Breakdown**: Analyze the provided RSI, MACD, and EMA data. What is the chart saying?
- **Bullish Catalysts vs. Bearish Risks**: Weigh the upside against the downside in the current market structure.
- **Final Recommendation**: You MUST include these lines EXACTLY:
  - Recommendation: Strong Buy | Buy | Hold | Sell | Strong Sell
  - Confidence Score (0-100): [Score]
  - Investment Horizon: Short | Medium | Long
  - Risk Level: Low | Medium | Extreme
  - Important Disclaimer: [Standard crypto disclaimer]`;

function buildGroqUserInput(bundle: any): string {
  const payload = {
    generatedAt: bundle.asOfIso,
    symbol: bundle.symbol,
    snapshot: bundle.snapshot,
    recentAggregates: bundle.aggregates.slice(-30), // last 30 days
    rsi: bundle.rsi.slice(-5), // latest 5 readings
    macd: bundle.macd.slice(-5),
    ema: bundle.ema.slice(-5),
    dataGaps: bundle.providerErrors,
  };

  return `Generate an institutional-grade crypto research note for the coin below, adhering to the requested sections.

DATA (JSON):
${JSON.stringify(payload)}`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ ticker: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rawParams = await ctx.params;
  const parsedParams = ParamsSchema.safeParse({ symbol: rawParams.ticker });
  if (!parsedParams.success) {
    return new Response("Invalid ticker.", { status: 400 });
  }

  const ticker = parsedParams.data.symbol;

  const rl = rateLimit({
    key: `ai-summary:crypto:${ip}:${ticker}`,
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

  const cacheKey = `ai-summary:crypto:${ticker}`;
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
    const bundle = await getCryptoResearchBundle(ticker);
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
      console.warn(`[Crypto AI] Rate limited on versatile model for ${ticker}, falling back to instant...`);
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
    console.error(`[Crypto AI] Error generating summary for ${ticker}:`, err);
    return new Response("Failed to generate AI summary.", { status: 502 });
  }
}
