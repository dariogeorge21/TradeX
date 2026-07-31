"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Combobox, ComboboxInput } from "@/components/ui/combobox";
import { MutualFundSearchDropdown } from "@/components/mutual-funds/MutualFundSearchDropdown";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { ApiErrorPayload } from "@/types/stocks";
import type { MutualFundSearchResult } from "@/types/mutual-funds";

const SearchResponseSchema = z.object({
  results: z.array(
    z.object({
      symbol: z.string(),
      name: z.string(),
      country: z.string().nullish(),
      currency: z.string().nullish(),
      fund_family: z.string().nullish(),
      fund_type: z.string().nullish(),
      performance_rating: z.number().nullish(),
      risk_rating: z.number().nullish(),
      exchange: z.string().nullish(),
      mic_code: z.string().nullish(),
    }).passthrough()
  ),
});

type Props = {
  className?: string;
  placeholder?: string;
};

export function MutualFundSearchBar({
  className,
  placeholder = "Search mutual funds (e.g., Vanguard, JNL)…",
}: Props) {
  const router = useRouter();
  const anchorRef = React.useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = React.useState<string>("");
  const debounced = useDebouncedValue(query, 250);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<MutualFundSearchResult[]>([]);

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
        const res = await fetch(`/api/mutual-funds/search?q=${encodeURIComponent(q)}`, {
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
        setResults(parsed.data.results as MutualFundSearchResult[]);
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
    <div ref={anchorRef} className={className}>
      <Combobox
        value={null}
        onInputValueChange={(val) => setQuery(val)}
        onValueChange={(symbol) => {
          if (!symbol) return;
          router.push(`/dashboard/mutual-funds/${encodeURIComponent(symbol)}`);
        }}
      >
        <ComboboxInput
          placeholder={placeholder}
          showClear
          showTrigger={false}
          className="w-full"
          aria-label="Search mutual funds"
        />
        <MutualFundSearchDropdown
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
