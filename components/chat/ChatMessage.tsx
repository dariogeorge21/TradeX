"use client";

import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`chat-message-row ${isUser ? "chat-message-row--user" : "chat-message-row--assistant"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="chat-avatar chat-avatar--bot" aria-hidden="true">
          <Bot size={16} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`chat-bubble ${isUser ? "chat-bubble--user" : "chat-bubble--assistant"}`}
        role="article"
        aria-label={isUser ? "Your message" : "TradeX AI response"}
      >
        {isUser ? (
          <p className="chat-bubble-text">{content}</p>
        ) : (
          <div className="chat-markdown">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="chat-md-h2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="chat-md-h3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="chat-md-p">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="chat-md-ul">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="chat-md-ol">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="chat-md-li">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="chat-md-strong">{children}</strong>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <code className="chat-md-code-block">{children}</code>
                  ) : (
                    <code className="chat-md-code-inline">{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="chat-md-pre">{children}</pre>
                ),
                table: ({ children }) => (
                  <div className="chat-md-table-wrap">
                    <table className="chat-md-table">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="chat-md-th">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="chat-md-td">{children}</td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="chat-md-blockquote">{children}</blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Streaming cursor */}
            {isStreaming && (
              <span className="chat-cursor" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="chat-avatar chat-avatar--user" aria-hidden="true">
          <User size={14} />
        </div>
      )}
    </motion.div>
  );
}
