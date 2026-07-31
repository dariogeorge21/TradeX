"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Combobox, ComboboxInput } from "@/components/ui/combobox";
import { SearchDropdown } from "@/components/stocks/SearchDropdown";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { ApiErrorPayload, StockSearchResult } from "@/types/stocks";

const SearchResponseSchema = z.object({
  results: z.array(
    z.object({
      symbol: z.string(),
      displaySymbol: z.string(),
      description: z.string(),
      type: z.string().optional(),
    })
  ),
});

type Props = {
  className?: string;
  placeholder?: string;
};

export function SearchBar({
  className,
  placeholder = "Search stocks (e.g., AAPL, Tesla)…",
}: Props) {
  const router = useRouter();
  const anchorRef = React.useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = React.useState<string>("");
  const debounced = useDebouncedValue(query, 250);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<StockSearchResult[]>([]);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as
            | ApiErrorPayload
            | null;
          throw new Error(payload?.error ?? `Search failed (${res.status})`);
        }

        const json = (await res.json()) as unknown;
        const parsed = SearchResponseSchema.safeParse(json);
        if (!parsed.success) {
          throw new Error("Unexpected search response.");
        }

        if (!active) return;
        setResults(parsed.data.results);
      } catch (e) {
        if (!active) return;
        const message = e instanceof Error ? e.message : "Search failed.";
        setError(message);
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

  return (
    <div ref={anchorRef} className={`relative ${className} ${isPending ? 'opacity-70 pointer-events-none transition-opacity duration-300' : ''}`}>
      <Combobox
        value={null}
        onInputValueChange={(val) => setQuery(val)}
        onValueChange={(symbol) => {
          if (!symbol) return;
          startTransition(() => {
            router.push(`/dashboard/stocks/${encodeURIComponent(symbol)}`);
          });
        }}
      >
        <ComboboxInput
          placeholder={placeholder}
          showClear={!isPending}
          showTrigger={false}
          className="w-full"
          aria-label="Search stocks"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
        <SearchDropdown
          anchor={anchorRef}
          query={query}
          loading={loading}
          error={error}
          results={results}
        />
      </Combobox>
    </div>
  );
}

