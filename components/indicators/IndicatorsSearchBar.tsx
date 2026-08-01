"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MarketIndicator } from "@/types/market-indicators";

// Since we can't easily import a server action here for dummy data without making it complex, 
// and the dummy data is static, we can fetch it via an API route or just import the static list if it's safe.
// For simplicity and matching forex search bar, we'll import the fallback data search directly.
// In a real app with database, we'd use an API route or server action.
import { searchIndicators } from "@/services/indicators-research";

export function IndicatorsSearchBar({
  className,
  placeholder = "Search indicators (e.g., RSI, MACD)...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<MarketIndicator[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function fetchSuggestions() {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      const results = await searchIndicators(query);
      setSuggestions(results.slice(0, 6));
    }
    fetchSuggestions();
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

  const navigateToIndicator = (id: string) => {
    setShowSuggestions(false);
    setQuery("");
    router.push(`/dashboard/indicators/${encodeURIComponent(id)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // If they press enter, just go to the first suggestion if available, or try the query as ID
    const targetId = suggestions.length > 0 ? suggestions[0].id : query.trim().toLowerCase();
    
    setShowSuggestions(false);
    router.push(`/dashboard/indicators/${encodeURIComponent(targetId)}`);
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
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => navigateToIndicator(res.id)}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-violet-500/10 hover:text-violet-500 rounded-lg transition-colors flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-[10px] text-violet-600 dark:text-violet-400">
                    {res.shortName.slice(0, 1)}
                  </div>
                  <span className="font-semibold">{res.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto">{res.shortName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
