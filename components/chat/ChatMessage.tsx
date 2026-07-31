"use client";

import { memo, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, RefreshCw } from "lucide-react";
import { StreamingCursor } from "@/components/chat/StreamingCursor";
import type { Components } from "react-markdown";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
  onCopy?: () => void;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

// ---------------------------------------------------------------------------
// Code block — language label + copy button + syntax highlighting
// ---------------------------------------------------------------------------
function CodeBlock({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace("language-", "") ?? "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed silently
    }
  }, [code]);

  return (
    <div className="chat-code-block-wrap">
      {/* Header bar */}
      <div className="chat-code-block-header">
        <span className="chat-code-block-lang">{language}</span>
        <button
          className="chat-code-copy-btn"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy code"}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <Copy size={13} />
          )}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Code body */}
      <pre className="chat-md-pre">
        <code className={className ?? ""}>{children}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Markdown component map — stable reference (defined outside render)
// ---------------------------------------------------------------------------
const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="chat-md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="chat-md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="chat-md-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="chat-md-h4">{children}</h4>,
  p: ({ children }) => <p className="chat-md-p">{children}</p>,
  ul: ({ children }) => <ul className="chat-md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="chat-md-ol">{children}</ol>,
  li: ({ children }) => <li className="chat-md-li">{children}</li>,
  strong: ({ children }) => <strong className="chat-md-strong">{children}</strong>,
  em: ({ children }) => <em className="chat-md-em">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="chat-md-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="chat-md-blockquote">{children}</blockquote>
  ),
  hr: () => <hr className="chat-md-hr" />,
  table: ({ children }) => (
    <div className="chat-md-table-wrap">
      <table className="chat-md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="chat-md-tr">{children}</tr>,
  th: ({ children }) => <th className="chat-md-th">{children}</th>,
  td: ({ children }) => <td className="chat-md-td">{children}</td>,
  // Code: inline vs block
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.startsWith("language-"));
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <code className="chat-md-code-inline">{children}</code>;
  },
  // Suppress pre wrapping — CodeBlock handles its own <pre>
  pre: ({ children }) => <>{children}</>,
};

// ---------------------------------------------------------------------------
// Thinking dots — shown before first token arrives
// ---------------------------------------------------------------------------
function ThinkingDots() {
  return (
    <div className="chat-thinking" aria-label="TradeX AI is thinking">
      <span className="chat-thinking-dot" style={{ animationDelay: "0ms" }} />
      <span className="chat-thinking-dot" style={{ animationDelay: "200ms" }} />
      <span className="chat-thinking-dot" style={{ animationDelay: "400ms" }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Format timestamp
// ---------------------------------------------------------------------------
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------------------------
// ChatMessage — memoized to avoid re-rendering all messages on every token
// ---------------------------------------------------------------------------
export const ChatMessage = memo(function ChatMessage({
  role,
  content,
  isStreaming = false,
  timestamp,
  onRegenerate,
  isLastAssistant = false,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [messageCopied, setMessageCopied] = useState(false);
  const isEmpty = content.trim() === "";

  const handleCopyMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    } catch {
      // Silent fail
    }
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`chat-message-row ${
        isUser ? "chat-message-row--user" : "chat-message-row--assistant"
      }`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="chat-avatar chat-avatar--bot" aria-hidden="true">
          <Bot size={15} />
        </div>
      )}

      {/* Bubble + actions column */}
      <div className="chat-message-col">
        {/* Bubble */}
        <div
          className={`chat-bubble ${
            isUser ? "chat-bubble--user" : "chat-bubble--assistant"
          }`}
          role="article"
          aria-label={isUser ? "Your message" : "TradeX AI response"}
        >
          {isUser ? (
            <p className="chat-bubble-text">{content}</p>
          ) : (
            <div className="chat-markdown">
              {/* Show thinking dots until first content arrives */}
              {isStreaming && isEmpty ? (
                <ThinkingDots />
              ) : (
                <>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={markdownComponents}
                  >
                    {content}
                  </ReactMarkdown>

                  {/* Blinking cursor while streaming */}
                  {isStreaming && <StreamingCursor />}
                </>
              )}
            </div>
          )}
        </div>

        {/* Message footer: timestamp + actions */}
        <div
          className={`chat-message-footer ${
            isUser ? "chat-message-footer--user" : ""
          }`}
        >
          {/* Timestamp */}
          {timestamp && (
            <span className="chat-message-time">{formatTime(timestamp)}</span>
          )}

          {/* Actions (visible on hover) */}
          {!isStreaming && content && (
            <div className="chat-message-actions">
              {/* Copy message */}
              <button
                className="chat-action-btn"
                onClick={handleCopyMessage}
                aria-label={messageCopied ? "Copied!" : "Copy message"}
                title={messageCopied ? "Copied!" : "Copy message"}
              >
                {messageCopied ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>

              {/* Regenerate (only on last assistant message) */}
              {!isUser && isLastAssistant && onRegenerate && (
                <button
                  className="chat-action-btn"
                  onClick={onRegenerate}
                  aria-label="Regenerate response"
                  title="Regenerate response"
                >
                  <RefreshCw size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="chat-avatar chat-avatar--user" aria-hidden="true">
          <User size={13} />
        </div>
      )}
    </motion.div>
  );
});
