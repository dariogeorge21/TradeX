"use client";

// ---------------------------------------------------------------------------
// StreamingCursor — blinking ▍ block cursor shown while AI is generating
// ---------------------------------------------------------------------------
export function StreamingCursor() {
  return (
    <span
      className="chat-streaming-cursor"
      aria-hidden="true"
      aria-label="Generating response"
    >
      ▍
    </span>
  );
}
