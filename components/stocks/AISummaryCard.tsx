"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationBadge, type Recommendation } from "@/components/stocks/RecommendationBadge";
import ReactMarkdown from "react-markdown";

function extractRecommendation(md: string): { rec: Recommendation | null; confidence: number | null } {
  const recMatch = md.match(/Recommendation:\s*(Strong Buy|Buy|Hold|Sell|Strong Sell)/i);
  const scoreMatch = md.match(/Confidence Score\s*\(0-100\)\s*[:\-]\s*(\d{1,3})/i);
  const rec = recMatch ? (recMatch[1] as Recommendation) : null;
  const confidence = scoreMatch ? Math.max(0, Math.min(100, Number(scoreMatch[1]))) : null;
  return { rec, confidence };
}

export function AISummaryCard({ symbol }: { symbol: string }) {
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
        const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}/ai-summary`, {
          signal: controller.signal,
        });

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

  const { rec, confidence } = React.useMemo(() => extractRecommendation(text), [text]);

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>AI Summary</CardTitle>
        {rec ? <RecommendationBadge recommendation={rec} confidenceScore={confidence} /> : null}
      </CardHeader>
      <CardContent>
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

