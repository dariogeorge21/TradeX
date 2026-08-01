"use client";

import * as React from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface IndicatorAISummaryCardProps {
  indicatorId: string;
  className?: string;
}

export function IndicatorAISummaryCard({ indicatorId, className }: IndicatorAISummaryCardProps) {
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function fetchSummary() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError("");
        setContent("");

        const res = await fetch(`/api/indicators/${indicatorId}/ai-summary`, {
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to generate AI summary.");
        }

        if (!res.body) {
          throw new Error("No response body.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            if (mounted) {
              setContent((prev) => prev + chunk);
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (mounted) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      mounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [indicatorId]);

  return (
    <Card className={cn("overflow-hidden border-violet-500/20 bg-violet-500/5 shadow-xl", className)}>
      <CardHeader className="bg-violet-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-violet-700 dark:text-violet-400">
          <Sparkles className="h-5 w-5" />
          AI Indicator Interpretation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 relative min-h-[200px]">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-rose-500 py-8">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-violet-500/10" />
                <Skeleton className="h-4 w-5/6 bg-violet-500/10" />
                <Skeleton className="h-4 w-4/6 bg-violet-500/10" />
                <Skeleton className="h-4 w-full bg-violet-500/10" />
                <Skeleton className="h-4 w-3/4 bg-violet-500/10" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
