"use client";

import {
  useRef,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";

const SUGGESTION_CHIPS = [
  "Analyze Apple (AAPL) fundamentals",
  "What is the P/E ratio?",
  "Explain the yield curve",
  "Best sectors in a recession?",
  "How to read an earnings report",
  "What drives oil prices?",
];

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  showSuggestions?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isStreaming,
  showSuggestions = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isStreaming && value.trim()) {
          onSend();
        }
      }
    },
    [isStreaming, value, onSend]
  );

  const handleChipClick = useCallback(
    (chip: string) => {
      onChange(chip);
      textareaRef.current?.focus();
    },
    [onChange]
  );

  const canSend = !isStreaming && value.trim().length > 0;

  return (
    <div className="chat-input-area">
      {/* Suggestion chips — shown only on welcome screen */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="chat-suggestions"
          aria-label="Suggested questions"
        >
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              className="chat-suggestion-chip"
              onClick={() => handleChipClick(chip)}
              aria-label={`Ask: ${chip}`}
            >
              {chip}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input row */}
      <div className="chat-input-wrap">
        <textarea
          ref={textareaRef}
          id="chat-input"
          className="chat-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about stocks, markets, earnings, macro trends…"
          rows={1}
          disabled={isStreaming}
          aria-label="Chat message input"
          aria-describedby="chat-input-hint"
          autoComplete="off"
          spellCheck
        />

        <button
          id="chat-send-btn"
          className={`chat-send-btn ${canSend ? "chat-send-btn--active" : ""}`}
          onClick={onSend}
          disabled={!canSend}
          aria-label={isStreaming ? "Generating response…" : "Send message"}
          title={isStreaming ? "Generating…" : "Send (Enter)"}
        >
          {isStreaming ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>

      <p id="chat-input-hint" className="chat-input-hint">
        Press <kbd>Enter</kbd> to send &bull; <kbd>Shift+Enter</kbd> for newline
      </p>
    </div>
  );
}
