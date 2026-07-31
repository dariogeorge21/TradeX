import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import {
  FINANCIAL_CHAT_SYSTEM_PROMPT,
  buildChatMessages,
  type ChatMessage,
} from "@/lib/ai/financialChatAgent";
import { HttpError } from "@/lib/http";

// ---------------------------------------------------------------------------
// Request schema validation
// ---------------------------------------------------------------------------
const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(50),
  sessionId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// Groq streaming helper — supports multi-turn messages array
// ---------------------------------------------------------------------------
async function streamGroqChat(
  messages: ChatMessage[],
  timeoutMs = 45_000
): Promise<ReadableStream<string>> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: FINANCIAL_CHAT_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
      temperature: 0.35,
      max_tokens: 2048,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new HttpError(
      `Groq API error ${res.status}: ${body}`,
      res.status
    );
  }

  const body = res.body;
  if (!body) throw new Error("Groq response stream missing.");

  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    start(ctrl) {
      let buf = "";

      const pump = async () => {
        const reader = body.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });

            while (true) {
              const idx = buf.indexOf("\n\n");
              if (idx === -1) break;
              const frame = buf.slice(0, idx);
              buf = buf.slice(idx + 2);

              const dataLine = frame
                .split("\n")
                .find((l) => l.startsWith("data: "));
              if (!dataLine) continue;
              const payload = dataLine.slice("data: ".length).trim();
              if (payload === "[DONE]") continue;

              let json: { choices?: Array<{ delta?: { content?: string } }> };
              try {
                json = JSON.parse(payload);
              } catch {
                continue;
              }

              const chunk = json?.choices?.[0]?.delta?.content;
              if (typeof chunk === "string") {
                ctrl.enqueue(chunk);
              }
            }
          }
          ctrl.close();
        } catch (e) {
          ctrl.error(e);
        } finally {
          reader.releaseLock();
        }
      };

      void pump();
    },
  });
}

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate request body
  let parsed: z.infer<typeof ChatRequestSchema>;
  try {
    const body = await req.json();
    parsed = ChatRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, sessionId } = parsed;
  const lastUserMessage = messages.findLast((m) => m.role === "user");
  if (!lastUserMessage) {
    return NextResponse.json({ error: "No user message found." }, { status: 400 });
  }

  // 3. Upsert chat session
  let activeSessionId = sessionId;

  if (!activeSessionId) {
    // Create a new session with title from first user message
    const title = lastUserMessage.content.slice(0, 80);
    const { data: session, error: sessionErr } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (sessionErr || !session) {
      console.error("Failed to create chat session:", sessionErr);
      return NextResponse.json(
        { error: "Failed to create chat session." },
        { status: 500 }
      );
    }
    activeSessionId = session.id;
  }

  // 4. Persist the user message
  await supabase.from("chat_messages").insert({
    session_id: activeSessionId,
    user_id: user.id,
    role: "user",
    content: lastUserMessage.content,
  });

  // 5. Build context window and stream response
  const contextMessages = buildChatMessages(messages);

  let groqStream: ReadableStream<string>;
  try {
    groqStream = await streamGroqChat(contextMessages);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    return NextResponse.json(
      { error: "AI service unavailable. Please try again." },
      { status }
    );
  }

  // 6. Pipe the GROQ stream to the client while collecting full response
  const encoder = new TextEncoder();
  let fullAssistantMessage = "";

  const responseStream = new ReadableStream({
    start(ctrl) {
      // First chunk: send session metadata so client can update URL
      const meta = JSON.stringify({ sessionId: activeSessionId }) + "\n\n";
      ctrl.enqueue(encoder.encode(`data: ${meta}`));

      const reader = groqStream.getReader();

      const pump = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            fullAssistantMessage += value;
            // Stream token to client as SSE
            ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ token: value })}\n\n`));
          }

          // Signal end of stream
          ctrl.enqueue(encoder.encode(`data: [DONE]\n\n`));
          ctrl.close();

          // 7. Persist the full assistant message after stream completes
          await supabase.from("chat_messages").insert({
            session_id: activeSessionId,
            user_id: user.id,
            role: "assistant",
            content: fullAssistantMessage,
          });
        } catch (e) {
          ctrl.error(e);
        } finally {
          reader.releaseLock();
        }
      };

      void pump();
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
