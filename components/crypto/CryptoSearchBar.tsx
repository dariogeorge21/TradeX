"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FALLBACK_CRYPTO_MARKET_SNAPSHOTS } from "@/lib/crypto-fallback-data";

export function CryptoSearchBar({
  className,
  placeholder = "Search crypto (e.g., BTC, ETH)...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Extract symbols from the dummy data for suggestions
  const allSymbols = React.useMemo(() => {
    return FALLBACK_CRYPTO_MARKET_SNAPSHOTS.map((s) => 
      s.ticker.replace("X:", "").replace("USD", "")
    );
  }, []);

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toUpperCase();
    return allSymbols.filter(s => s.includes(q) || s.startsWith(q)).slice(0, 6);
  }, [query, allSymbols]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToSymbol = (symbol: string) => {
    const formattedQuery = `X:${symbol}USD`;
    setShowSuggestions(false);
    setQuery("");
    router.push(`/dashboard/crypto/${encodeURIComponent(formattedQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Auto format query for Massive API format, e.g. BTC -> X:BTCUSD
    let formattedQuery = query.trim().toUpperCase();
    if (!formattedQuery.startsWith("X:")) {
      if (!formattedQuery.endsWith("USD") && formattedQuery.length <= 5) {
        formattedQuery = `X:${formattedQuery}USD`;
      } else {
        formattedQuery = `X:${formattedQuery}`;
      }
    }
    
    setShowSuggestions(false);
    router.push(`/dashboard/crypto/${encodeURIComponent(formattedQuery)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2 outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button type="submit" className="hidden">Search</button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-foreground/10 bg-card/90 p-2 shadow-xl backdrop-blur-xl z-50">
            {suggestions.map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => navigateToSymbol(symbol)}
                className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-amber-500/10 hover:text-amber-500 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400">
                  {symbol.slice(0, 1)}
                </div>
                {symbol}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
