import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ApiErrorPayload } from "@/types/stocks";
import type { MutualFundSearchResult } from "@/types/mutual-funds";
import { rateLimit } from "@/lib/rate-limit";

const QuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .transform((v) => v.trim()),
});

type TwelveDataSearchResult = {
  symbol: string;
  name: string;
  country: string;
  currency: string;
  fund_family: string;
  fund_type: string;
  performance_rating: number;
  risk_rating: number;
  exchange: string;
  mic_code: string;
};

type TwelveDataSearchResponse = {
  data?: TwelveDataSearchResult[];
  status: string;
  message?: string;
};

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit({ key: `mf-search:${ip}`, limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "TwelveData API key not configured." },
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

  const q = parsed.data.q.toLowerCase();
  
  // To avoid hitting the endpoint too hard and since we are fetching a huge list,
  // we could potentially use the symbol lookup endpoint if it exists or fetch and filter.
  // We'll fetch the mutual funds list from TwelveData and filter.
  // Ideally, twelve data would have a search endpoint for mutual funds, but we'll use /list
  
  const url = new URL("https://api.twelvedata.com/mutual_funds/list");
  url.searchParams.set("source", "docs"); // using docs source as per API docs
  url.searchParams.set("apikey", apiKey);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache the list for an hour
    });

    if (!res.ok) {
      return NextResponse.json<ApiErrorPayload>(
        { error: `TwelveData returned ${res.status}` },
        { status: res.status }
      );
    }

    const data: TwelveDataSearchResponse = (await res.json()) as TwelveDataSearchResponse;
    if (data.status === "error") {
      throw new Error(data.message || "API error");
    }

    const results: MutualFundSearchResult[] = (data.data ?? [])
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.symbol.toLowerCase().includes(q) ||
          r.fund_family?.toLowerCase().includes(q)
      )
      .slice(0, 12);

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, max-age=60", // Short cache for the specific search
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json<ApiErrorPayload>(
      { error: "Failed to fetch mutual fund search results." },
      { status: 502 }
    );
  }
}
