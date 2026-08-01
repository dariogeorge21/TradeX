import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { cache30s } from "@/lib/ttl-cache";
import { getIndicatorResearchBundle } from "@/services/indicators-research";

const ParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9.\-_]+$/),
});

const SYSTEM_PROMPT = `You are an elite Quantitative Analyst and Technical Trading Expert. Your expertise spans statistical market analysis, momentum, trend tracking, and volatility.

Your goal is to provide a highly actionable, accurate, and structured indicator research note. Your analysis must directly help traders understand the current technical and macro setup for this specific market indicator.

Strict Directives:
1. Never hallucinate or invent numbers. Only use the provided data.
2. If data is missing, clearly state it.
3. Be definitive but balanced. State clear opinions on the short-term directional bias implied by this indicator.
4. Output format: structured markdown with headings, bold text, and bullet points.

You MUST include the following sections exactly:
- **Executive Summary**: A punchy 2-sentence overview of the indicator's current reading.
- **Directional Bias**: State definitively whether the bias is **Bullish**, **Bearish**, or **Neutral** based on current data.
- **Indicator Breakdown**: Briefly explain what the current values mean (e.g., oversold, trending upwards, high volatility).
- **Recent Momentum**: What is the data saying about recent changes over the past few periods?
- **Final Verdict**: You MUST include these lines EXACTLY:
  - Bias: Bullish | Bearish | Neutral
  - Confidence Score (0-100): [Score]
  - Signal: [Buy / Sell / Neutral]
  - Important Disclaimer: This is an AI-generated technical analysis interpretation and not financial advice.`;

function buildGroqUserInput(bundle: any): string {
  const payload = {
    indicator: bundle.indicator.name,
    type: bundle.indicator.type,
    snapshot: bundle.snapshot,
    recentData: bundle.historicalData.slice(-5), // Last 5 periods
  };

  return `Generate an institutional-grade technical analysis research note for the market indicator below, adhering to the requested sections.

DATA (JSON):
${JSON.stringify(payload)}`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rawParams = await ctx.params;
  const parsedParams = ParamsSchema.safeParse(rawParams);
  if (!parsedParams.success) {
    return new Response("Invalid indicator ID.", { status: 400 });
  }

  const indicatorId = parsedParams.data.id.toLowerCase();

  const rl = rateLimit({
    key: `ind-ai-summary:${ip}:${indicatorId}`,
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

  const cacheKey = `ind-ai-summary:${indicatorId}`;
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
    const bundle = await getIndicatorResearchBundle(indicatorId);
    
    if (!bundle) {
       return new Response("Indicator not found.", { status: 404 });
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
      console.warn(`[IND AI Summary] Rate limited on versatile model for ${indicatorId}, falling back to instant...`);
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
    console.error(`[IND AI Summary] Error generating summary for ${indicatorId}:`, err);
    return new Response("Failed to generate AI summary.", { status: 502 });
  }
}
