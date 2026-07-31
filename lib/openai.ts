import "server-only";

import { HttpError } from "@/lib/http";

export type OpenAIStreamParams = {
  systemPrompt: string;
  userInput: string;
  model: string;
  timeoutMs?: number;
};

function getApiKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured.");
  return apiKey;
}

export async function streamOpenAIText({
  systemPrompt,
  userInput,
  model,
  timeoutMs = 40_000,
}: OpenAIStreamParams): Promise<ReadableStream<string>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      stream: true,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    throw new HttpError(`OpenAI returned ${res.status}`, res.status);
  }

  const body = res.body;
  if (!body) {
    throw new Error("OpenAI response stream missing.");
  }

  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    start(streamController) {
      let buffer = "";

      const pump = async () => {
        const reader = body.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            while (true) {
              const idx = buffer.indexOf("\n\n");
              if (idx === -1) break;
              const frame = buffer.slice(0, idx);
              buffer = buffer.slice(idx + 2);

              const dataLine = frame
                .split("\n")
                .find((line) => line.startsWith("data: "));
              if (!dataLine) continue;
              const payload = dataLine.slice("data: ".length).trim();
              if (payload === "[DONE]") continue;

              let json: { choices?: Array<{ delta?: { content?: string } }> };
              try {
                json = JSON.parse(payload);
              } catch {
                continue;
              }

              const content = json?.choices?.[0]?.delta?.content;
              if (typeof content === "string") {
                streamController.enqueue(content);
              }
            }
          }
          streamController.close();
        } catch (e) {
          streamController.error(e);
        } finally {
          reader.releaseLock();
        }
      };

      void pump();
    },
  });
}

