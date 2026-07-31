"use client";

import * as React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import type { StockSearchResult } from "@/types/stocks";

type Props = {
  anchor: React.RefObject<Element | null>;
  query: string;
  loading: boolean;
  error: string | null;
  results: StockSearchResult[];
};

export function SearchDropdown({
  anchor,
  query,
  loading,
  error,
  results,
}: Props) {
  return (
    <ComboboxContent anchor={anchor} className="p-0">
      <ComboboxList>
        {loading && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>Searching…</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="size-4" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && query.trim().length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Type a company name or ticker
          </div>
        )}

        {!loading &&
          !error &&
          results.map((r) => (
            <ComboboxItem key={r.symbol} value={r.symbol}>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.displaySymbol}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {r.description}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                  {r.type ?? ""}
                </div>
              </div>
            </ComboboxItem>
          ))}

        <ComboboxEmpty>
          {query.trim().length > 0 ? "No matching companies found." : ""}
        </ComboboxEmpty>
      </ComboboxList>
    </ComboboxContent>
  );
}
