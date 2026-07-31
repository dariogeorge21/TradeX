"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularStockCard } from "./PopularStockCard";
import { fetchPopularStocksData, type PopularStockData } from "@/app/actions/stocks";

const KNOWN_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "TSM",
  "AVGO", "V", "WMT", "JPM", "UNH", "MA", "LLY", "JNJ", "PG", "HD",
  "ORCL", "CVX", "MRK", "KO", "PEP", "BAC", "COST", "MCD", "CRM",
  "ADBE", "CSCO", "NFLX"
];

const ITEMS_PER_PAGE = 12;

export function PopularStocks() {
  const [currentPage, setCurrentPage] = useState(0);
  const [stocksData, setStocksData] = useState<Record<string, PopularStockData>>({});
  const [loadingPages, setLoadingPages] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // We use a ref to track which pages are currently being fetched to avoid React strict mode double-fetching issues.
  const fetchingPages = useRef<Set<number>>(new Set());

  const totalPages = Math.ceil(KNOWN_STOCKS.length / ITEMS_PER_PAGE);

  useEffect(() => {
    async function loadPage(pageIndex: number) {
      if (fetchingPages.current.has(pageIndex)) return; // already in flight

      const start = pageIndex * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      // Determine what hasn't been loaded yet. If we have the data already, no need to fetch again.
      // But we can still skip if the length is 0.
      const hasMissingData = KNOWN_STOCKS.slice(start, end).some((sym) => !stocksData[sym]);
      if (!hasMissingData) return;

      const symbolsToFetch = KNOWN_STOCKS.slice(start, end);

      fetchingPages.current.add(pageIndex);
      setLoadingPages((prev) => ({ ...prev, [pageIndex]: true }));

      try {
        const data = await fetchPopularStocksData(symbolsToFetch);
        const newData: Record<string, PopularStockData> = {};
        for (const item of data) {
          newData[item.symbol] = item;
        }
        setStocksData((prev) => ({ ...prev, ...newData }));
      } catch (err) {
        setError("Failed to load popular stocks.");
      } finally {
        setLoadingPages((prev) => ({ ...prev, [pageIndex]: false }));
        fetchingPages.current.delete(pageIndex);
      }
    }

    loadPage(currentPage);

    // Preload next page for better UX
    if (currentPage < totalPages - 1) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, stocksData, totalPages]);

  const currentSymbols = KNOWN_STOCKS.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Popular Stocks
        </h2>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-foreground/5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-background shadow-none"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground w-12 text-center tabular-nums">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-background shadow-none"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-destructive font-medium">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSymbols.map((symbol) => {
          const data = stocksData[symbol];

          if (!data) {
            return (
              <div key={symbol} className="h-[140px] rounded-xl border border-foreground/10 bg-card/40 p-5 flex flex-col justify-between animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex items-end justify-between mt-4">
                  <Skeleton className="h-4 w-12 rounded" />
                  <div className="space-y-1 items-end flex flex-col">
                    <Skeleton className="h-7 w-20 rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <PopularStockCard
              key={symbol}
              symbol={symbol}
              profile={data.profile}
              quote={data.quote}
            />
          );
        })}
      </div>
    </div>
  );
}
