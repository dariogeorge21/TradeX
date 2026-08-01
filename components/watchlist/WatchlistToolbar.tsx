"use client";

import { LayoutGrid, List, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchlistToolbarProps {
  layout: "grid" | "table";
  onLayoutChange: (layout: "grid" | "table") => void;
  onGenerateAISummary: () => void;
  isGeneratingAI: boolean;
  selectedCount: number;
}

export function WatchlistToolbar({
  layout,
  onLayoutChange,
  onGenerateAISummary,
  isGeneratingAI,
  selectedCount,
}: WatchlistToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b border-white/10 mb-6">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <h2 className="text-xl font-semibold text-white">Your Assets</h2>
        {selectedCount > 0 && (
          <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-md font-medium border border-indigo-500/30">
            {selectedCount} selected
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          onClick={onGenerateAISummary}
          disabled={isGeneratingAI}
          variant="outline"
          className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-xl"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGeneratingAI ? "Analyzing Portfolio..." : "AI Portfolio Summary"}
        </Button>

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLayoutChange("grid")}
            className={`px-3 py-1.5 rounded-lg ${
              layout === "grid"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLayoutChange("table")}
            className={`px-3 py-1.5 rounded-lg ${
              layout === "table"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
