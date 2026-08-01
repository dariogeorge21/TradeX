"use client";

import { useState, useTransition } from "react";
import { Bookmark, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleMutualFundWatchlist } from "@/app/actions/mutual-funds-watchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MutualFundWatchlistButtonProps {
  fund: {
    fund_code: string;
    fund_name: string;
    amc?: string;
    category?: string;
    logo_url?: string;
  };
  initialIsSaved?: boolean;
  showText?: boolean;
  className?: string;
}

export function MutualFundWatchlistButton({
  fund,
  initialIsSaved = false,
  showText = false,
  className,
}: MutualFundWatchlistButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);

    startTransition(async () => {
      try {
        const result = await toggleMutualFundWatchlist(fund);
        if (result.success) {
          setIsSaved(result.action === "added");
          toast.success(
            result.action === "added"
              ? "Added to Watchlist"
              : "Removed from Watchlist",
            {
              description: fund.fund_name,
            }
          );
        } else {
          // Revert on server error
          setIsSaved(previousState);
          toast.error(result.error || "Failed to update watchlist");
        }
      } catch (error) {
         // Revert on fetch error
         setIsSaved(previousState);
         toast.error("Failed to update watchlist");
      }
    });
  };

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size={showText ? "default" : "icon"}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "transition-all duration-300",
        isSaved
          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border-transparent hover:border-emerald-500/30"
          : "",
        className
      )}
    >
      {isPending ? (
        <Loader2 className={cn("h-4 w-4 animate-spin", showText && "mr-2")} />
      ) : isSaved ? (
        <Check className={cn("h-4 w-4", showText && "mr-2")} />
      ) : (
        <Bookmark className={cn("h-4 w-4", showText && "mr-2")} />
      )}
      {showText && (
        <span>{isSaved ? "Saved" : "Add to Watchlist"}</span>
      )}
    </Button>
  );
}
