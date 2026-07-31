import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ApiErrorPayload, StockSearchResult } from "@/types/stocks";
import { rateLimit } from "@/lib/rate-limit";

const QuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .transform((v) => v.trim()),
});

type FinnhubSearchResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type?: string;
};

type FinnhubSearchResponse = {
  count: number;
  result: FinnhubSearchResult[];
};

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit({ key: `stock-search:${ip}`, limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Finnhub API key not configured." },
      { status: 500 }
    );
  }

  const parsed = QuerySchema.safeParse({ q: req.nextUrl.searchParams.get("q") });
  if (!parsed.success) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Invalid query." },
      { status: 400 }
    );
  }

  const url = new URL("https://finnhub.io/api/v1/search");
  url.searchParams.set("q", parsed.data.q);
  url.searchParams.set("token", apiKey);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json<ApiErrorPayload>(
        { error: `Finnhub returned ${res.status}` },
        { status: res.status }
      );
    }

    const data: FinnhubSearchResponse = (await res.json()) as FinnhubSearchResponse;
    const seen = new Set<string>();
    const results: StockSearchResult[] = (data.result ?? [])
      .filter((r) => typeof r.symbol === "string" && /^[A-Z]+$/.test(r.symbol))
      .filter((r) => {
        const key = r.symbol.toUpperCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 12)
      .map((r) => ({
        symbol: r.symbol,
        displaySymbol: r.displaySymbol ?? r.symbol,
        description: r.description ?? "",
        type: r.type,
      }));

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
        },
      }
    );
  } catch {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Failed to fetch company search results." },
      { status: 502 }
    );
  }
}
