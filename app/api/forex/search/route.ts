import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { searchForexTickers } from "@/lib/forex-fallback-data";

const QuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .transform((v) => v.trim()),
});

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit({ key: `fx-search:${ip}`, limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  const parsed = QuerySchema.safeParse({ q: req.nextUrl.searchParams.get("q") });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query." },
      { status: 400 }
    );
  }

  const q = parsed.data.q;
  const results = searchForexTickers(q);

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}
