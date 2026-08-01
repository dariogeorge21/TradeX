"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWatchlist } from "@/app/actions/watchlist";
import { AssetType } from "@/types/watchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface WatchlistToggleButtonProps {
  symbol: string;
  assetType: AssetType;
  className?: string;
  showText?: boolean;
}

export function WatchlistToggleButton({ symbol, assetType, className, showText = false }: WatchlistToggleButtonProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setIsLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from("watchlists")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("symbol", symbol.toUpperCase())
        .single();
        
      if (data) setIsWatched(true);
      setIsLoading(false);
    };
    checkStatus();
  }, [symbol]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await toggleWatchlist(symbol, assetType);
      if (res.success) {
        setIsWatched(res.action === "added");
        toast.success(
          res.action === "added" 
            ? `${symbol} added to watchlist` 
            : `${symbol} removed from watchlist`
        );
      } else {
        toast.error(res.error || "Failed to update watchlist");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isWatched ? "default" : "outline"}
      size={showText ? "default" : "icon"}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "transition-all duration-300",
        isWatched 
          ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-lg shadow-indigo-500/20" 
          : "bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
        className
      )}
    >
      <Star className={cn("w-4 h-4", showText && "mr-2", isWatched && "fill-current")} />
      {showText && (isWatched ? "Watched" : "Watch")}
    </Button>
  );
}
