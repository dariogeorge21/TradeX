"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

interface DetailsHeaderProps {
  backHref: string;
  backLabel: string;
  searchHref: string;
  searchLabel: string;
  action?: React.ReactNode;
}

export function DetailsHeader({
  backHref,
  backLabel,
  searchHref,
  searchLabel,
  action,
}: DetailsHeaderProps) {
  const [loadingBack, setLoadingBack] = React.useState(false);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  return (
    <div className="flex my-4 items-center justify-between">
      <Link
        href={backHref}
        onClick={() => setLoadingBack(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {loadingBack ? (
          <Loader2 className="size-4 animate-spin text-emerald-400" />
        ) : (
          <ArrowLeft className="size-4" />
        )}
        <span>{backLabel}</span>
      </Link>
      <div className="flex items-center gap-3">
        {action}
        <Link
          href={searchHref}
          onClick={() => setLoadingSearch(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-card/60 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors backdrop-blur"
        >
          {loadingSearch ? (
            <Loader2 className="size-3.5 animate-spin text-emerald-400" />
          ) : (
            <Search className="size-3.5 text-emerald-400" />
          )}
          <span>{searchLabel}</span>
        </Link>
      </div>
    </div>
  );
}
