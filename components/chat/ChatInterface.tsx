"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart2, DollarSign, Globe } from "lucide-react";

import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSessionList, type ChatSession } from "@/components/chat/ChatSessionList";
import { ChatInput } from "@/components/chat/ChatInput";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  initialSessions: ChatSession[];
  userId: string;
}

// ---------------------------------------------------------------------------
// Welcome screen cards
// ---------------------------------------------------------------------------
const WELCOME_CARDS = [
  {
    icon: TrendingUp,
    title: "Stock Analysis",
    desc: "Deep dives into any publicly traded company",
    color: "emerald",
  },
  {
    icon: BarChart2,
    title: "Technical Analysis",
    desc: "Chart patterns, indicators, and price action",
    color: "blue",
  },
  {
    icon: DollarSign,
    title: "Fundamental Research",
    desc: "Earnings, valuations, financial statements",
    color: "purple",
  },
  {
    icon: Globe,
    title: "Macro Economics",
    desc: "Fed policy, inflation, global market trends",
    color: "amber",
  },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function ChatInterface({ initialSessions, userId }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---------------------------------------------------------------------------
  // Load a session's messages from the API
  // ---------------------------------------------------------------------------
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoadingSession(true);
    setActiveSessionId(sessionId);
    setMessages([]);

    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`);
      if (!res.ok) throw new Error("Failed to load session");
      const data = (await res.json()) as { messages: Message[] };
      setMessages(data.messages);
    } catch {
      setMessages([]);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Start a new chat
  // ---------------------------------------------------------------------------
  const handleNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setActiveSessionId(null);
    setMessages([]);
    setInputValue("");
    setIsStreaming(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Delete a session
  // ---------------------------------------------------------------------------
  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/chat/sessions/${sessionId}`, { method: "DELETE" });
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          handleNewChat();
        }
      } catch {
        // Silent fail
      }
    },
    [activeSessionId, handleNewChat]
  );

  // ---------------------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------------------
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;

    // Optimistically add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsStreaming(true);

    // Prepare the assistant streaming placeholder
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    // Build message history for context
    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          sessionId: activeSessionId,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Stream unavailable");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice("data: ".length).trim();
          if (payload === "[DONE]") break;

          try {
            const parsed = JSON.parse(payload) as {
              sessionId?: string;
              token?: string;
            };

            // First chunk — session metadata
            if (parsed.sessionId && !activeSessionId) {
              const newSessionId = parsed.sessionId;
              setActiveSessionId(newSessionId);

              // Add to session list
              setSessions((prev) => {
                const exists = prev.some((s) => s.id === newSessionId);
                if (exists) return prev;
                return [
                  {
                    id: newSessionId,
                    title: text.slice(0, 80),
                    updated_at: new Date().toISOString(),
                  },
                  ...prev,
                ];
              });
            }

            // Token chunk — append to assistant message
            if (parsed.token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.token }
                    : m
                )
              );
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "⚠️ Something went wrong. Please check your connection and try again.",
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [inputValue, isStreaming, messages, activeSessionId]);

  const isWelcomeScreen = messages.length === 0 && !isLoadingSession;

  return (
    <div className="chat-shell">
      {/* Session history sidebar */}
      <ChatSessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={loadSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main chat area */}
      <div className="chat-main">
        {/* Messages area */}
        <div className="chat-messages-area" aria-live="polite" aria-label="Conversation">
          {/* Welcome screen */}
          <AnimatePresence mode="wait">
            {isWelcomeScreen && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="chat-welcome"
              >
                {/* Logo / heading */}
                <div className="chat-welcome-logo" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" width={44} height={44}>
                    <rect
                      width="40"
                      height="40"
                      rx="12"
                      fill="oklch(0.70 0.18 162)"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M8 28L16 16L22 22L28 12L32 16"
                      stroke="oklch(0.70 0.18 162)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="32" cy="12" r="3" fill="oklch(0.70 0.18 162)" />
                  </svg>
                </div>
                <h1 className="chat-welcome-title">
                  TradeX{" "}
                  <span className="gradient-text-emerald">AI Analyst</span>
                </h1>
                <p className="chat-welcome-subtitle">
                  Your expert financial markets analyst. Ask about stocks,
                  earnings, macro trends, or anything markets-related.
                </p>

                {/* Capability cards */}
                <div className="chat-welcome-cards" role="list">
                  {WELCOME_CARDS.map(({ icon: Icon, title, desc, color }) => (
                    <div
                      key={title}
                      className={`chat-welcome-card chat-welcome-card--${color}`}
                      role="listitem"
                    >
                      <div className="chat-welcome-card-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="chat-welcome-card-title">{title}</p>
                        <p className="chat-welcome-card-desc">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {isLoadingSession && (
            <div className="chat-loading" aria-label="Loading conversation…">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`chat-skeleton chat-skeleton--${i % 2 === 0 ? "user" : "assistant"}`} />
              ))}
            </div>
          )}

          {/* Message list */}
          {!isLoadingSession &&
            messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={
                  isStreaming && idx === messages.length - 1 && msg.role === "assistant"
                }
              />
            ))}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isStreaming={isStreaming}
          showSuggestions={isWelcomeScreen}
        />
      </div>
    </div>
  );
}
