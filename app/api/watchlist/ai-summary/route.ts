import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are an elite Portfolio Manager and Quantitative Analyst. Your expertise lies in analyzing collections of assets, identifying concentration risks, and providing actionable portfolio insights.

Your goal is to provide a highly actionable, accurate, and structured watchlist analysis note based on the provided user watchlist data.

Strict Directives:
1. Never hallucinate or invent numbers. Only use the provided data.
2. Be definitive but balanced. State clear opinions on the portfolio's diversification and risk profile.
3. Output format: structured markdown with headings, bold text, and bullet points.

You MUST include the following sections exactly:
- **Executive Summary**: A punchy 2-sentence overview of the watchlist.
- **Top Opportunity**: Identify the most promising asset in the watchlist and briefly explain why based on the provided metrics (e.g., strong momentum, high AI score).
- **Highest Risk**: Identify the riskiest asset and briefly explain why (e.g., high volatility, significant recent losses).
- **Sector Breakdown & Diversification**: Briefly summarize the sector concentration and whether the watchlist is well-diversified.
- **Diversification Score (0-100)**: [Score]
- **AI Recommendation**: Provide one actionable piece of advice for this specific watchlist (e.g., "Consider adding healthcare exposure" or "Watch for resistance on [Ticker]").`;

function buildGroqUserInput(watchlistData: any): string {
  return `Generate an institutional-grade portfolio analysis for the watchlist below, adhering strictly to the requested sections.

WATCHLIST DATA (JSON):
${JSON.stringify(watchlistData)}`;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit({
    key: `watchlist-ai-summary:${ip}`,
    limit: 5,
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

  try {
    const body = await req.json();
    if (!body || !body.watchlist || !Array.isArray(body.watchlist)) {
      return new Response("Invalid request body. Expected { watchlist: [...] }", { status: 400 });
    }

    const userInput = buildGroqUserInput(body.watchlist);

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
      console.warn(`[Watchlist AI Summary] Rate limited on versatile model, falling back to instant...`);
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
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // ignore JSON parse error for partial lines
                }
              }
            }
          }
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
      },
    });
  } catch (err: any) {
    console.error(`[Watchlist AI Summary] Error generating summary:`, err);
    return new Response("Failed to generate AI summary.", { status: 502 });
  }
}
