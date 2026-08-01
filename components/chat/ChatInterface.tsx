"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart2, DollarSign, Globe, X, AlertCircle } from "lucide-react";

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
  timestamp: Date;
}

interface Toast {
  id: string;
  message: string;
  type: "error" | "info";
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
// Toast component
// ---------------------------------------------------------------------------
function ToastNotification({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="chat-toast-container" aria-live="assertive" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`chat-toast chat-toast--${toast.type}`}
            role="alert"
          >
            <AlertCircle size={15} className="chat-toast-icon" />
            <span className="chat-toast-message">{toast.message}</span>
            <button
              className="chat-toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function ChatInterface({ initialSessions }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const userScrolledUpRef = useRef(false);
  const lastUserInputRef = useRef<string>("");

  // ---------------------------------------------------------------------------
  // Toast helpers
  // ---------------------------------------------------------------------------
  const showToast = useCallback((message: string, type: Toast["type"] = "error") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---------------------------------------------------------------------------
  // Smart auto-scroll — pause when user scrolls up, resume at bottom
  // ---------------------------------------------------------------------------
  const scrollToBottom = useCallback((force = false) => {
    if (!force && userScrolledUpRef.current) return;
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, []);

  // Detect manual scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      // If user scrolled more than 80px from bottom → pause
      userScrolledUpRef.current = distanceFromBottom > 80;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll on new content
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Escape key to stop streaming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStreaming) {
        abortControllerRef.current?.abort();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isStreaming]);

  // ---------------------------------------------------------------------------
  // Load session messages
  // ---------------------------------------------------------------------------
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoadingSession(true);
    setActiveSessionId(sessionId);
    setMessages([]);
    userScrolledUpRef.current = false;

    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`);
      if (!res.ok) throw new Error("Failed to load session");
      const data = (await res.json()) as { messages: Array<{ id: string; role: "user" | "assistant"; content: string; created_at?: string }> };
      setMessages(
        data.messages.map((m) => ({
          ...m,
          timestamp: m.created_at ? new Date(m.created_at) : new Date(),
        }))
      );
    } catch {
      showToast("Failed to load conversation. Please try again.");
      setMessages([]);
    } finally {
      setIsLoadingSession(false);
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // New chat
  // ---------------------------------------------------------------------------
  const handleNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setActiveSessionId(null);
    setMessages([]);
    setInputValue("");
    setIsStreaming(false);
    userScrolledUpRef.current = false;
  }, []);

  // ---------------------------------------------------------------------------
  // Delete session
  // ---------------------------------------------------------------------------
  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/chat/sessions/${sessionId}`, { method: "DELETE" });
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSessionId === sessionId) handleNewChat();
      } catch {
        showToast("Failed to delete conversation.");
      }
    },
    [activeSessionId, handleNewChat, showToast]
  );

  // ---------------------------------------------------------------------------
  // Stop generating
  // ---------------------------------------------------------------------------
  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Core send logic — extracted for reuse by Regenerate
  // ---------------------------------------------------------------------------
  const sendMessages = useCallback(
    async (
      history: Array<{ role: "user" | "assistant"; content: string }>,
      assistantId: string,
      currentSessionId: string | null,
      userText: string
    ) => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      userScrolledUpRef.current = false;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            ...(currentSessionId ? { sessionId: currentSessionId } : {}),
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
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
              if (parsed.sessionId && !currentSessionId) {
                const newSessionId = parsed.sessionId;
                setActiveSessionId(newSessionId);
                setSessions((prev) => {
                  if (prev.some((s) => s.id === newSessionId)) return prev;
                  return [
                    {
                      id: newSessionId,
                      title: userText.slice(0, 80),
                      updated_at: new Date().toISOString(),
                    },
                    ...prev,
                  ];
                });
              }

              // Token chunk
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
              // Skip malformed SSE chunks
            }
          }
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          showToast("Rate limit exceeded. Please try again later.");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                  ...m,
                  content:
                    "⚠️Rate limit exceeded. Please try again later."
                }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [showToast]
  );

  // ---------------------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------------------
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;

    lastUserInputRef.current = text;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsStreaming(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    await sendMessages(history, assistantId, activeSessionId, text);
  }, [inputValue, isStreaming, messages, activeSessionId, sendMessages]);

  // ---------------------------------------------------------------------------
  // Regenerate last assistant response
  // ---------------------------------------------------------------------------
  const handleRegenerate = useCallback(async () => {
    if (isStreaming) return;

    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    // Remove last assistant message
    setMessages((prev) => {
      const lastAssistantIdx = prev.map((m) => m.role).lastIndexOf("assistant");
      if (lastAssistantIdx === -1) return prev;
      return prev.slice(0, lastAssistantIdx);
    });

    setIsStreaming(true);

    const assistantId = `assistant-regen-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    // Rebuild history up to (and including) last user message
    const historyUpToLastUser = messages
      .slice(0, messages.map((m) => m.id).lastIndexOf(lastUserMsg.id) + 1)
      .map((m) => ({ role: m.role, content: m.content }));

    await sendMessages(historyUpToLastUser, assistantId, activeSessionId, lastUserMsg.content);
  }, [isStreaming, messages, activeSessionId, sendMessages]);

  const isWelcomeScreen = messages.length === 0 && !isLoadingSession;

  // Find index of last assistant message for regenerate button
  const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf("assistant");

  return (
    <div className="chat-shell">
      {/* Toast notifications */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

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
        {/* Messages scrollable area */}
        <div
          ref={scrollContainerRef}
          className="chat-messages-area"
          aria-live="polite"
          aria-label="Conversation"
        >
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
                <div
                  key={i}
                  className={`chat-skeleton chat-skeleton--${i % 2 === 0 ? "user" : "assistant"
                    }`}
                />
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
                  isStreaming &&
                  idx === messages.length - 1 &&
                  msg.role === "assistant"
                }
                timestamp={msg.timestamp}
                isLastAssistant={idx === lastAssistantIdx}
                onRegenerate={handleRegenerate}
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
          onStop={handleStop}
          isStreaming={isStreaming}
          showSuggestions={isWelcomeScreen}
        />
      </div>
    </div>
  );
}
