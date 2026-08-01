"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { ForexSnapshotTicker } from "@/types/forex";
import ReactMarkdown from "react-markdown";

export function ForexAISummaryCard({
  ticker,
  meta,
}: {
  ticker: string;
  meta: ForexSnapshotTicker;
}) {
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    async function fetchStream() {
      try {
        const res = await fetch(`/api/forex/${encodeURIComponent(ticker)}/ai-summary`);
        if (!res.ok) throw new Error("Stream failed");
        
        if (!res.body) throw new Error("No body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        setLoading(false);

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setContent((prev) => prev + text);
        }
      } catch (err) {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchStream();

    return () => {
      active = false;
    };
  }, [ticker]);

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-violet-500">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-bold tracking-tight">TradeX AI Analysis</h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-violet-500/20 rounded w-3/4"></div>
          <div className="h-4 bg-violet-500/20 rounded w-5/6"></div>
          <div className="h-4 bg-violet-500/20 rounded w-2/3"></div>
          <div className="h-4 bg-violet-500/20 rounded w-4/5"></div>
        </div>
      ) : error ? (
        <div className="text-rose-500 text-sm">Failed to load AI summary.</div>
      ) : (
        <div className="prose prose-sm dark:prose-invert prose-violet max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
          <span className="inline-block w-2 h-4 ml-1 bg-violet-500 animate-pulse" />
        </div>
      )}
    </div>
  );
}
