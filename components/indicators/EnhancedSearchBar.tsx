"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  TrendingUp,
  Zap,
  X,
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";
import { MarketIndicator } from "@/types/market-indicators";
import { searchIndicators } from "@/services/indicators-research";
import { cn } from "@/lib/utils";

const TRENDING_INDICATORS = [
  { id: "rsi", name: "RSI", label: "Overbought signals" },
  { id: "vix", name: "VIX", label: "Elevated volatility" },
  { id: "macd", name: "MACD", label: "Bullish crossover" },
  { id: "fgindex", name: "Fear & Greed", label: "Extreme greed zone" },
];

const AI_SUGGESTIONS = [
  "Show me bullish momentum indicators",
  "Which volatility measures are elevated?",
  "Best trend-following indicators now",
];

export function EnhancedSearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<MarketIndicator[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("tradex_recent_indicators");
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 4));
    } catch {
      // ignore
    }
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside close
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    searchIndicators(query).then((results) => {
      setSuggestions(results.slice(0, 5));
    });
  }, [query]);

  const saveRecent = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem("tradex_recent_indicators", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const navigateTo = (id: string, name: string) => {
    saveRecent(name);
    setIsOpen(false);
    setQuery("");
    router.push(`/dashboard/indicators/${encodeURIComponent(id)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      navigateTo(suggestions[activeIndex >= 0 ? activeIndex : 0].id, suggestions[activeIndex >= 0 ? activeIndex : 0].name);
    } else {
      saveRecent(query);
      router.push(`/dashboard/indicators/${encodeURIComponent(query.trim().toLowerCase())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? suggestions : [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      navigateTo(items[activeIndex].id, items[activeIndex].name);
    }
  };

  const showDropdown = isOpen;
  const showResults = query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative flex items-center gap-3 rounded-2xl border bg-background/80 backdrop-blur-xl px-4 py-3.5 shadow-lg transition-all duration-300",
            isOpen
              ? "border-violet-500/60 shadow-violet-500/20 shadow-xl ring-1 ring-violet-500/30"
              : "border-white/10 hover:border-white/20"
          )}
        >
          <Search
            className={cn(
              "h-5 w-5 shrink-0 transition-colors duration-200",
              isOpen ? "text-violet-400" : "text-muted-foreground"
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search indicators — RSI, MACD, VIX..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); setActiveIndex(-1); }}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {/* Keyboard shortcut badge */}
          <div className="hidden sm:flex items-center gap-1 shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
            <Command className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">K</span>
          </div>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 z-50 overflow-hidden">
          {showResults ? (
            /* Search Results */
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Results
              </p>
              {suggestions.length > 0 ? (
                suggestions.map((ind, i) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => navigateTo(ind.id, ind.name)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group",
                      activeIndex === i
                        ? "bg-violet-500/15 text-violet-400"
                        : "hover:bg-white/5 text-foreground"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 text-xs font-bold shrink-0">
                      {ind.shortName.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{ind.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ind.category} · {ind.type}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-violet-400 transition-colors shrink-0" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No indicators found for &quot;{query}&quot;
                </div>
              )}
            </div>
          ) : (
            /* Default state: recents + trending + AI suggestions */
            <div className="p-3 space-y-1">
              {recentSearches.length > 0 && (
                <div>
                  <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Recent
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                    {recentSearches.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setQuery(r)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/30 hover:bg-violet-500/10 transition-all"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-white/5 pt-2">
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-orange-400" /> Trending Now
                </p>
                {TRENDING_INDICATORS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigateTo(t.id, t.name)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-bold shrink-0">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/5 pt-2">
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-violet-400" /> AI Suggestions
                </p>
                {AI_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-violet-500/10 transition-colors text-left group"
                  >
                    <Zap className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-violet-300">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
