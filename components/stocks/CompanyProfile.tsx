import Image from "next/image";
import Link from "next/link";
import { Building2, Globe, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyProfile as CompanyProfileType, Fundamentals } from "@/types/stock-research";

function formatNumber(n: number | null) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function CompanyProfile({
  profile,
  fundamentals,
}: {
  profile: CompanyProfileType | null;
  fundamentals: Fundamentals | null;
}) {
  const website = profile?.website ?? null;

  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="truncate">
              {profile?.name ?? profile?.ticker ?? "Company"}
            </span>
            {profile?.ticker && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {profile.ticker}
              </span>
            )}
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4" aria-hidden="true" />
              {profile?.industry ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {profile?.country ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-4" aria-hidden="true" />
              {profile?.exchange ?? "—"}
            </span>
          </div>
        </div>

        {profile?.logo ? (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted/30 ring-1 ring-foreground/10">
            <Image
              src={profile.logo}
              alt=""
              fill
              className="object-contain p-2"
              sizes="48px"
              unoptimized
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4">
        {fundamentals?.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {fundamentals.description}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            Company description is unavailable for this symbol.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">Market Cap</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {formatNumber(profile?.marketCapitalization ?? null)}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">Shares Out.</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {formatNumber(profile?.sharesOutstanding ?? null)}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">IPO Date</div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {profile?.ipo ?? "—"}
            </div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-background/40 p-3">
            <div className="text-xs text-muted-foreground">Website</div>
            <div className="mt-1 truncate text-sm font-medium">
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  {safeHostname(website) ?? website}
                </Link>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
