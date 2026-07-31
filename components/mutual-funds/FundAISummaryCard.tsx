"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";

import type { MutualFundSummary } from "@/types/mutual-funds";

export function FundAISummaryCard({
  symbol,
  meta,
}: {
  symbol: string;
  meta?: MutualFundSummary | null;
}) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [text, setText] = React.useState<string>("");

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function run() {
      setLoading(true);
      setError(null);
      setText("");

      try {
        // Forward metadata as query params so the API can build a bundle without re-fetching
        const params = new URLSearchParams();
        if (meta) {
          if (meta.name) params.set("name", meta.name);
          if (meta.fund_family) params.set("fund_family", meta.fund_family);
          if (meta.fund_type) params.set("fund_type", meta.fund_type);
          if (meta.currency) params.set("currency", meta.currency);
          if ((meta as any).exchange) params.set("exchange", (meta as any).exchange);
          if (meta.ytd_return) params.set("ytd_return", String(meta.ytd_return));
        }
        const qs = params.toString();
        const res = await fetch(
          `/api/mutual-funds/${encodeURIComponent(symbol)}/ai-summary${qs ? `?${qs}` : ""}`,
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

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          if (!active) return;
          setText(buf);
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "AI summary failed.");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    void run();

    return () => {
      active = false;
      controller.abort();
    };
  }, [symbol]);

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5"
      />
      <CardHeader className="flex flex-row items-center justify-between gap-4 relative">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-blue-400" />
          AI Mutual Fund Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="text-sm leading-relaxed text-foreground/90">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-5 mb-2 text-foreground" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-2 text-foreground" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2 text-foreground" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
