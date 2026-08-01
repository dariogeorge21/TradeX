"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchForexTickers } from "@/lib/forex-fallback-data";

export function ForexSearchBar({
  className,
  placeholder = "Search forex (e.g., EURUSD, GBPUSD)...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchForexTickers(query).slice(0, 6);
  }, [query]);

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
    const formattedQuery = `C:${symbol}`;
    setShowSuggestions(false);
    setQuery("");
    router.push(`/dashboard/forex/${encodeURIComponent(formattedQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    let formattedQuery = query.trim().toUpperCase();
    if (!formattedQuery.startsWith("C:")) {
      formattedQuery = `C:${formattedQuery}`;
    }
    
    setShowSuggestions(false);
    router.push(`/dashboard/forex/${encodeURIComponent(formattedQuery)}`);
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
            {suggestions.map((res) => {
              const symbol = res.ticker.replace("C:", "");
              return (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => navigateToSymbol(symbol)}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-violet-500/10 hover:text-violet-500 rounded-lg transition-colors flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-[10px] text-violet-600 dark:text-violet-400">
                    {symbol.slice(0, 1)}
                  </div>
                  <span className="font-semibold">{res.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto">{symbol}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
