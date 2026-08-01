"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WatchlistItem } from "@/types/watchlist";
import { useEffect, useState } from "react";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
}

export function AISummaryModal({ isOpen, onClose, watchlist }: AISummaryModalProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSummary("");
      setError(null);
      return;
    }

    let isMounted = true;
    const generateSummary = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const payload = watchlist.map(item => ({
          symbol: item.symbol,
          assetType: item.assetType,
          price: item.price,
          changePercent: item.changePercent,
          aiScore: item.aiScore,
          aiSentiment: item.aiSentiment,
        }));

        const response = await fetch("/api/watchlist/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ watchlist: payload })
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          if (isMounted) {
            setSummary(prev => prev + decoder.decode(value, { stream: true }));
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateSummary();

    return () => {
      isMounted = false;
    };
  }, [isOpen, watchlist]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white shadow-2xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b border-white/10 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Portfolio Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 min-h-0 custom-scrollbar mt-4 space-y-4">
          {error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl">
              <p className="font-medium">Error Generating Analysis</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : summary ? (
            <div className="prose prose-invert prose-indigo max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-400 mt-6 mb-3 flex items-center gap-2" {...props}><BrainCircuit className="w-5 h-5" />{props.children}</h2>,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-slate-300 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <BrainCircuit className="w-12 h-12 text-indigo-400 relative z-10 animate-pulse" />
              </div>
              <p>Analyzing {watchlist.length} assets...</p>
            </div>
          )}
          {isLoading && summary && (
            <div className="flex items-center gap-2 text-indigo-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating insights...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
