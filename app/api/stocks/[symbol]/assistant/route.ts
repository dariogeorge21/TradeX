import { NextRequest } from "next/server";
import { z } from "zod";

const SYSTEM_PROMPT = `You are a specialized AI assistant for TradeX, focusing on a specific stock.
You must provide concise, professional, and insightful answers to user questions about this stock.
Do not hallucinate data. Be direct and helpful.`;

const ParamsSchema = z.object({
  symbol: z.string().transform((s) => s.toUpperCase()),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("GROQ_API_KEY not configured", { status: 500 });
  }

  const { symbol } = ParamsSchema.parse(await context.params);

  try {
    const { messages } = await req.json();

    // Sanitize: map "ai" -> "assistant" and drop anything with an invalid role
    const sanitizedMessages = (Array.isArray(messages) ? messages : [])
      .map((m: { role: string; content: string }) => ({
        ...m,
        role: m.role === "ai" ? "assistant" : m.role,
      }))
      .filter((m: { role: string }) => m.role === "user" || m.role === "assistant");

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\nThe stock in focus is ${symbol}.` },
          ...sanitizedMessages,
        ],
        stream: true,
        temperature: 0.3,
      }),
    });

    if (!groqRes.ok || !groqRes.body) {
      const errorText = await groqRes.text().catch(() => "");
      throw new Error(`Groq API error: ${groqRes.status} ${errorText}`);
    }

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
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
                    controller.enqueue(encoder.encode(data.choices[0].delta.content));
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

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error(`[Stock Assistant] Error:`, err);
    return new Response("Failed to generate AI response.", { status: 502 });
  }
}
