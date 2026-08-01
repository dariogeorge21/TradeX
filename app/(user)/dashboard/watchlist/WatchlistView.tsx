"use client";

import { useState, useMemo } from "react";
import { WatchlistItem, WatchlistStats as StatsType, WatchlistFilters as FiltersType } from "@/types/watchlist";
import { WatchlistHero } from "@/components/watchlist/WatchlistHero";
import { WatchlistStats } from "@/components/watchlist/WatchlistStats";
import { WatchlistFilters } from "@/components/watchlist/WatchlistFilters";
import { WatchlistToolbar } from "@/components/watchlist/WatchlistToolbar";
import { WatchlistGrid } from "@/components/watchlist/WatchlistGrid";
import { WatchlistTable } from "@/components/watchlist/WatchlistTable";
import { WatchlistEmptyState } from "@/components/watchlist/WatchlistEmptyState";
import { RemoveDialog } from "@/components/watchlist/RemoveDialog";
import { removeFromWatchlist } from "@/app/actions/watchlist";
import { toast } from "sonner";
import { AISummaryModal } from "@/components/watchlist/AISummaryModal";

interface WatchlistViewProps {
  initialItems: WatchlistItem[];
  stats: StatsType;
}

export function WatchlistView({ initialItems, stats }: WatchlistViewProps) {
  const [items, setItems] = useState<WatchlistItem[]>(initialItems);
  const [layout, setLayout] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState<FiltersType>({
    searchQuery: "",
    sortBy: "newest",
  });

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (i) => i.symbol.toLowerCase().includes(q) || i.name?.toLowerCase().includes(q)
      );
    }

    // Asset Type
    if (filters.assetType) {
      result = result.filter((i) => i.assetType === filters.assetType);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "alphabetical":
          return a.symbol.localeCompare(b.symbol);
        case "highest_gain":
          return (b.changePercent || -9999) - (a.changePercent || -9999);
        case "highest_loss":
          return (a.changePercent || 9999) - (b.changePercent || 9999);
        case "highest_price":
          return (b.price || 0) - (a.price || 0);
        case "lowest_price":
          return (a.price || 999999) - (b.price || 999999);
        case "ai_score":
          return (b.aiScore || 0) - (a.aiScore || 0);
        case "most_volatile":
          // using abs change percent as simple volatility proxy
          return Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [items, filters]);

  const handleRemove = async () => {
    if (!itemToRemove) return;
    setIsRemoving(true);
    
    try {
      const res = await removeFromWatchlist(itemToRemove);
      if (res.success) {
        setItems(items.filter(i => i.symbol !== itemToRemove));
        toast.success(`${itemToRemove} removed from watchlist`);
      } else {
        toast.error(res.error || "Failed to remove item");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsRemoving(false);
      setItemToRemove(null);
    }
  };

  if (items.length === 0) {
    return <WatchlistEmptyState />;
  }

  return (
    <div className="space-y-6">
      <WatchlistHero totalItems={items.length} />
      
      <WatchlistStats stats={stats} />
      
      <WatchlistFilters filters={filters} onFiltersChange={setFilters} />
      
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <WatchlistToolbar 
          layout={layout} 
          onLayoutChange={setLayout} 
          onGenerateAISummary={() => setIsAIModalOpen(true)}
          isGeneratingAI={false}
          selectedCount={0}
        />
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No assets match your filters.
          </div>
        ) : layout === "grid" ? (
          <WatchlistGrid items={filteredItems} onRemove={setItemToRemove} />
        ) : (
          <WatchlistTable items={filteredItems} onRemove={setItemToRemove} />
        )}
      </div>

      <RemoveDialog 
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
        onConfirm={handleRemove}
        isRemoving={isRemoving}
        symbol={itemToRemove || ""}
      />

      {isAIModalOpen && (
        <AISummaryModal 
          isOpen={isAIModalOpen} 
          onClose={() => setIsAIModalOpen(false)} 
          watchlist={items} 
        />
      )}
    </div>
  );
}
