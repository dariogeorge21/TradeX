"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularMutualFundCard } from "./PopularMutualFundCard";
import { fetchPopularMutualFundsData, getTrendingMutualFunds, type PopularMutualFundData, type TrendingMutualFund } from "@/app/actions/mutual-funds";
import { motion } from "framer-motion";

const FALLBACK_FUNDS: TrendingMutualFund[] = [
  { symbol: "FXAIX", name: "Fidelity 500 Index Fund" },
  { symbol: "VTSAX", name: "Vanguard Total Stock Market Index Fund" },
  { symbol: "VFIAX", name: "Vanguard 500 Index Fund" },
  { symbol: "PRASX", name: "T. Rowe Price Spectrum Conservative Allocation" },
  { symbol: "FCNTX", name: "Fidelity Contrafund" },
  { symbol: "VWENX", name: "Vanguard Wellington Fund" }, 
  { symbol: "AGTHX", name: "The Growth Fund of America" },
  { symbol: "VADAX", name: "Invesco Discovery Mid Cap Growth" },
  { symbol: "TRBCX", name: "T. Rowe Price Blue Chip Growth" },
  { symbol: "FDGRX", name: "Fidelity Growth Company" },
  { symbol: "SWPPX", name: "Schwab S&P 500 Index Fund" },
  { symbol: "VINIX", name: "Vanguard Institutional Index Fund" }
];

const ITEMS_PER_PAGE = 6;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function PopularMutualFunds() {
  const [currentPage, setCurrentPage] = useState(0);
  const [fundsData, setFundsData] = useState<Record<string, PopularMutualFundData>>({});
  const [loadingPages, setLoadingPages] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const [knownFunds, setKnownFunds] = useState<TrendingMutualFund[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const fetchingPages = useRef<Set<number>>(new Set());

  const totalPages = Math.ceil(knownFunds.length / ITEMS_PER_PAGE);

  useEffect(() => {
    getTrendingMutualFunds().then((data) => {
      setKnownFunds(data && data.length > 0 ? data : FALLBACK_FUNDS);
      setLoadingInitial(false);
    }).catch(() => {
      setKnownFunds(FALLBACK_FUNDS);
      setLoadingInitial(false);
    });
  }, []);

  useEffect(() => {
    if (knownFunds.length === 0) return;

    async function loadPage(pageIndex: number) {
      if (fetchingPages.current.has(pageIndex)) return;

      const start = pageIndex * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      const hasMissingData = knownFunds.slice(start, end).some((fund) => !fundsData[fund.symbol]);
      if (!hasMissingData) return;

      const symbolsToFetch = knownFunds.slice(start, end).map(f => f.symbol);

      fetchingPages.current.add(pageIndex);
      setLoadingPages((prev) => ({ ...prev, [pageIndex]: true }));

      try {
        const data = await fetchPopularMutualFundsData(symbolsToFetch);
        const newData: Record<string, PopularMutualFundData> = {};
        for (const item of data) {
          newData[item.symbol] = item;
        }
        setFundsData((prev) => ({ ...prev, ...newData }));
      } catch (err) {
        setError("Failed to load popular mutual funds.");
      } finally {
        setLoadingPages((prev) => ({ ...prev, [pageIndex]: false }));
        fetchingPages.current.delete(pageIndex);
      }
    }

    loadPage(currentPage);

    if (currentPage < totalPages - 1) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, fundsData, totalPages, knownFunds]);

  const currentSymbols = knownFunds.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Popular Mutual Funds
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

      {loadingInitial ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="h-[140px] rounded-xl border border-foreground/10 bg-card/40 p-5 flex flex-col justify-between animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32 rounded bg-emerald-500/10" />
                  <Skeleton className="h-5 w-16 rounded bg-emerald-500/10" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <Skeleton className="h-4 w-12 rounded bg-emerald-500/10" />
                <div className="space-y-1 items-end flex flex-col">
                  <Skeleton className="h-7 w-20 rounded bg-emerald-500/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {currentSymbols.map((fund) => {
            const data = fundsData[fund.symbol];

            if (!data) {
              return (
                <motion.div key={fund.symbol} variants={itemVariants} className="h-[140px] rounded-xl border border-foreground/10 bg-card/40 p-5 flex flex-col justify-between animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-32 rounded bg-emerald-500/10" />
                      <Skeleton className="h-5 w-16 rounded bg-emerald-500/10" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <Skeleton className="h-4 w-12 rounded bg-emerald-500/10" />
                    <div className="space-y-1 items-end flex flex-col">
                      <Skeleton className="h-7 w-20 rounded bg-emerald-500/10" />
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div key={fund.symbol} variants={itemVariants}>
                <PopularMutualFundCard
                  symbol={fund.symbol}
                  name={fund.name}
                  summary={data.summary}
                  performance_rating={data.performance_rating}
                  risk_rating={data.risk_rating}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
