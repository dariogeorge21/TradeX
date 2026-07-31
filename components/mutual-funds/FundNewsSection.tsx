import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsItem } from "@/types/mutual-funds";

function formatDate(ts: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function FundNewsSection({ news }: { news: NewsItem[] }) {
  return (
    <Card className="border border-foreground/10 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Related News</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {news.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent news found for this fund or fund family.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {news.slice(0, 10).map((n) => (
              <article
                key={n.url}
                className="group rounded-2xl border border-foreground/10 bg-background/40 p-3 transition-colors hover:border-foreground/15"
              >
                <div className="flex gap-3">
                  {n.image ? (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                      <Image
                        src={n.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="truncate">{n.source}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {formatDate(n.datetimeUnixSeconds)}
                      </span>
                    </div>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
                      {n.headline}
                    </h3>
                    {n.summary ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {n.summary}
                      </p>
                    ) : null}
                    <div className="mt-2">
                      <Link
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 hover:text-emerald-200"
                      >
                        <span>Open</span>
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
