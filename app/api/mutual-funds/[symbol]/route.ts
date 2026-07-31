import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { getMutualFundBundle } from "@/services/mutual-fund-research";

const ParamsSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9.\-]+$/)
    .transform((s) => s.toUpperCase()),
});

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rawParams = await ctx.params;
  const parsedParams = ParamsSchema.safeParse(rawParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid symbol." }, { status: 400 });
  }

  const rl = rateLimit({
    key: `mf-data:${ip}:${parsedParams.data.symbol}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const bundle = await getMutualFundBundle(parsedParams.data.symbol);
    return NextResponse.json(bundle, {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=59",
      },
    });
  } catch (e: any) {
    console.error(`[Mutual Fund API] Failed to fetch data for ${parsedParams.data.symbol}:`, e);
    return NextResponse.json(
      { error: "Failed to fetch mutual fund data." },
      { status: 502 }
    );
  }
}
