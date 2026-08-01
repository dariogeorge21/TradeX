"use client";

import { WatchlistItem } from "@/types/watchlist";
import { WatchlistCard } from "./WatchlistCard";

interface WatchlistGridProps {
  items: WatchlistItem[];
  onRemove: (symbol: string) => void;
}

export function WatchlistGrid({ items, onRemove }: WatchlistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <WatchlistCard 
          key={item.id} 
          item={item} 
          index={index} 
          onRemove={onRemove} 
        />
      ))}
    </div>
  );
}
