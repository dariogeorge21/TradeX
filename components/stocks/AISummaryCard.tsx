"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { RecommendationBadge, type Recommendation } from "@/components/stocks/RecommendationBadge";
import { StreamingCursor } from "@/components/chat/StreamingCursor";
import { Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import type { Components } from "react-markdown";

// ---------------------------------------------------------------------------
// Extract recommendation + confidence from the streamed markdown
// ---------------------------------------------------------------------------
function extractRecommendation(md: string): {
  rec: Recommendation | null;
  confidence: number | null;
} {
  const recMatch = md.match(/Recommendation:\s*(Strong Buy|Buy|Hold|Sell|Strong Sell)/i);
  const scoreMatch = md.match(/Confidence Score\s*\(0-100\)\s*[:\-]\s*(\d{1,3})/i);
  const rec = recMatch ? (recMatch[1] as Recommendation) : null;
  const confidence = scoreMatch
    ? Math.max(0, Math.min(100, Number(scoreMatch[1])))
    : null;
  return { rec, confidence };
}

// ---------------------------------------------------------------------------
// Thinking dots (shown before first token)
// ---------------------------------------------------------------------------
function ThinkingDots() {
  return (
    <div className="chat-thinking" aria-label="AI is generating…">
      <span className="chat-thinking-dot" style={{ animationDelay: "0ms" }} />
      <span className="chat-thinking-dot" style={{ animationDelay: "200ms" }} />
      <span className="chat-thinking-dot" style={{ animationDelay: "400ms" }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code block: language label + copy button
// ---------------------------------------------------------------------------
function CodeBlock({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const language = className?.replace("language-", "") ?? "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  return (
    <div className="chat-code-block-wrap my-2">
      <div className="chat-code-block-header">
        <span className="chat-code-block-lang">{language}</span>
        <button
          className="chat-code-copy-btn"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="chat-md-pre">
        <code className={className ?? ""}>{children}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stable markdown component map
// ---------------------------------------------------------------------------
const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mt-5 mb-2 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold mt-5 mb-2 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-4 mb-1.5 text-foreground">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic opacity-80">{children}</em>,
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
    <blockquote className="chat-md-blockquote my-2">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="chat-md-table-wrap my-3">
      <table className="chat-md-table">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="chat-md-th">{children}</th>,
  td: ({ children }) => <td className="chat-md-td">{children}</td>,
  code: ({ children, className }) => {
    if (className?.startsWith("language-")) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <code className="chat-md-code-inline">{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
};

// ---------------------------------------------------------------------------
// AISummaryCard
// ---------------------------------------------------------------------------
export function AISummaryCard({ symbol }: { symbol: string }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [text, setText] = React.useState<string>("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [messageCopied, setMessageCopied] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const run = React.useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let active = true;

    setLoading(true);
    setIsStreaming(false);
    setError(null);
    setText("");

    try {
      const res = await fetch(
        `/api/stocks/${encodeURIComponent(symbol)}/ai-summary`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `AI summary failed (${res.status})`);
      }

      const body = res.body;
      if (!body) throw new Error("Missing stream.");

      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      setLoading(false);
      setIsStreaming(true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        if (!active) return;
        setText(buf);
      }
    } catch (e) {
      if (!active) return;
      if ((e as Error)?.name !== "AbortError") {
        setError(e instanceof Error ? e.message : "AI summary failed.");
        setLoading(false);
      }
    } finally {
      if (active) {
        setIsStreaming(false);
        setLoading(false);
      }
      active = false;
    }
  }, [symbol]);

  React.useEffect(() => {
    void run();
    return () => {
      abortRef.current?.abort();
    };
  }, [run]);

  const { rec, confidence } = React.useMemo(() => extractRecommendation(text), [text]);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    } catch {
      // silent
    }
  };

  const isEmpty = text.trim() === "";

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary opacity-80" />
          AI Summary
        </CardTitle>
        <div className="flex items-center gap-2">
          {rec && !isStreaming ? (
            <RecommendationBadge recommendation={rec} confidenceScore={confidence} />
          ) : null}
          {/* Copy button */}
          {!isStreaming && text && (
            <button
              className="chat-action-btn"
              onClick={handleCopyMessage}
              aria-label={messageCopied ? "Copied!" : "Copy summary"}
              title={messageCopied ? "Copied!" : "Copy summary"}
            >
              {messageCopied ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          )}
          {/* Regenerate button */}
          {!isStreaming && (text || error) && (
            <button
              className="chat-action-btn"
              onClick={run}
              aria-label="Regenerate AI summary"
              title="Regenerate AI summary"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Thinking dots: shown before first token */}
        {loading && isEmpty && <ThinkingDots />}

        {/* Skeleton shimmer while waiting (no dots visible yet — dots appear right away) */}
        {loading && !isEmpty && null}

        {/* Error */}
        {error && !loading && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Content */}
        {!error && (loading || text) && (
          <div className="text-sm leading-relaxed text-foreground/90">
            {isEmpty && loading ? null : (
              <>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={mdComponents}
                >
                  {text}
                </ReactMarkdown>
                {isStreaming && <StreamingCursor />}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
