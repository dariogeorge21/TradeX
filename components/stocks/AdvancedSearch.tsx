"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, History, TrendingUp, Sparkles, Building } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { StockSearchResult } from "@/types/stocks";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export function AdvancedSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 250);
  
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StockSearchResult[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>(["AAPL", "TSLA", "NVDA"]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Search failed");
        
        const json = await res.json();
        if (!active) return;
        setResults(json.results || []);
      } catch (e) {
        if (!active) return;
        setResults([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    void run();
    return () => {
      active = false;
      controller.abort();
    };
  }, [debounced]);

  const handleSelect = (symbol: string) => {
    setOpen(false);
    if (!recentSearches.includes(symbol)) {
      setRecentSearches(prev => [symbol, ...prev].slice(0, 5));
    }
    router.push(`/dashboard/stocks/${encodeURIComponent(symbol)}`);
  };

  return (
    <>
      <div className="relative group w-full cursor-pointer max-w-2xl mx-auto" onClick={() => setOpen(true)}>
        <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-primary to-blue-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
        <div className="relative flex items-center w-full h-14 md:h-16 bg-background/80 backdrop-blur-xl rounded-xl shadow-lg border border-foreground/10 hover:border-foreground/20 transition-all px-4">
          <Search className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground mr-3" />
          <span className="flex-1 text-base md:text-lg text-muted-foreground">Search stocks, ETFs, or sectors...</span>
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for AAPL, Tesla, Microsoft..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No results found.</p>
                <p className="text-sm text-muted-foreground mt-1">Try searching for a company name or ticker.</p>
              </div>
            )}
          </CommandEmpty>

          {!query && (
            <>
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((ticker) => (
                  <CommandItem key={ticker} onSelect={() => handleSelect(ticker)}>
                    <History className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{ticker}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Trending">
                <CommandItem onSelect={() => handleSelect("NVDA")}>
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="flex-1">NVIDIA Corp</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">NVDA</Badge>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("PLTR")}>
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="flex-1">Palantir Technologies</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">PLTR</Badge>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="AI Suggestions">
                <CommandItem onSelect={() => handleSelect("MSFT")}>
                  <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                  <span className="flex-1">Microsoft</span>
                  <span className="text-xs text-muted-foreground">Strong AI infrastructure growth</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("AMD")}>
                  <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                  <span className="flex-1">Advanced Micro Devices</span>
                  <span className="text-xs text-muted-foreground">Undervalued AI play</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {query && results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.symbol}
                  value={`${result.symbol} ${result.description}`}
                  onSelect={() => handleSelect(result.symbol)}
                  className="py-3"
                >
                  <Building className="mr-3 h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold">{result.symbol}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{result.description}</span>
                  </div>
                  {result.type && (
                    <Badge variant="outline" className="text-[10px]">{result.type}</Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
