"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Waves,
  Volume2,
  LineChart,
  Globe,
  DollarSign,
  Layers,
  Zap,
  Star,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { IndicatorSnapshot } from "@/types/market-indicators";
import { MarketIndicator } from "@/types/market-indicators";
import { getIndicatorMeta, MARKET_INDICATORS } from "@/lib/indicators-fallback-data";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { EnhancedSearchBar } from "@/components/indicators/EnhancedSearchBar";
import { MarketSnapshot } from "@/components/indicators/MarketSnapshot";
import { IndicatorCard } from "@/components/indicators/IndicatorCard";

// ─── Category config ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All", icon: <Layers className="h-3.5 w-3.5" /> },
  { id: "Trend", label: "Trend", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { id: "Momentum", label: "Momentum", icon: <Zap className="h-3.5 w-3.5" /> },
  { id: "Volatility", label: "Volatility", icon: <Waves className="h-3.5 w-3.5" /> },
  { id: "Volume", label: "Volume", icon: <Volume2 className="h-3.5 w-3.5" /> },
  { id: "Sentiment", label: "Sentiment", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "Market", label: "Market", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "Moving Averages", label: "Moving Avg", icon: <LineChart className="h-3.5 w-3.5" /> },
  { id: "Macro Indicators", label: "Macro", icon: <Globe className="h-3.5 w-3.5" /> },
  { id: "Economic Indicators", label: "Economic", icon: <DollarSign className="h-3.5 w-3.5" /> },
];

// ─── Featured Indicators ─────────────────────────────────────────────────────

const FEATURED_IDS = ["rsi", "macd", "vix", "fgindex", "bbands", "atr", "adx", "sma"];

// ─── Stat Ticker ─────────────────────────────────────────────────────────────

function StatTicker({ snapshots }: { snapshots: IndicatorSnapshot[] }) {
  const bullCount = snapshots.filter((s) => s.signal === "Buy" || s.signal === "Strong Buy").length;
  const bearCount = snapshots.filter((s) => s.signal === "Sell" || s.signal === "Strong Sell").length;
  const neutralCount = snapshots.length - bullCount - bearCount;

  const stats = [
    { label: "Bullish Signals", value: bullCount, color: "text-emerald-400" },
    { label: "Bearish Signals", value: bearCount, color: "text-rose-400" },
    { label: "Neutral", value: neutralCount, color: "text-slate-400" },
    { label: "Indicators Tracked", value: MARKET_INDICATORS.length, color: "text-violet-400" },
    { label: "Updated", value: "Live", color: "text-blue-400" },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-4 shrink-0">
          {i > 0 && <div className="h-4 w-px bg-white/10" />}
          <div className="text-center">
            <p className={cn("text-lg font-black tabular-nums", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide whitespace-nowrap">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Category Chips ──────────────────────────────────────────────────────────

function CategoryChips({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 shrink-0",
            active === cat.id
              ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20"
              : "border-white/8 bg-card/40 text-muted-foreground hover:border-white/20 hover:bg-card/60 hover:text-foreground"
          )}
        >
          <span className={active === cat.id ? "text-white/80" : "text-muted-foreground/60"}>
            {cat.icon}
          </span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// ─── Featured Section ─────────────────────────────────────────────────────────

function FeaturedSection({ snapshots }: { snapshots: IndicatorSnapshot[] }) {
  const router = useRouter();
  const featured = FEATURED_IDS.map((id) => {
    const snap = snapshots.find((s) => s.id === id);
    const meta = getIndicatorMeta(id);
    return { id, snap, meta };
  }).filter((f) => f.meta);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15">
            <Star className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Featured Indicators</h2>
            <p className="text-[11px] text-muted-foreground">High market attention right now</p>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground/60 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">
          TRENDING
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {featured.map((f, i) => {
          const snap = f.snap;
          const isPos = snap?.trend === "Bullish";
          const isNeg = snap?.trend === "Bearish";

          return (
            <MotionDiv
              key={f.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => router.push(`/dashboard/indicators/${f.id}`)}
                className="group flex flex-col gap-2 rounded-2xl border border-white/8 bg-card/50 backdrop-blur-sm p-4 min-w-[140px] hover:border-violet-500/30 hover:bg-card/70 hover:-translate-y-0.5 transition-all duration-200 text-left shadow-sm hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 text-[10px] font-bold">
                    {f.meta!.shortName.slice(0, 2)}
                  </div>
                  {snap && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      isPos ? "bg-emerald-500/10 text-emerald-400" :
                      isNeg ? "bg-rose-500/10 text-rose-400" :
                      "bg-slate-500/10 text-slate-400"
                    )}>
                      {snap.signal}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">{f.meta!.shortName}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[110px]">{f.meta!.name}</p>
                </div>
                {snap && (
                  <div className={cn("flex items-center gap-1 text-xs font-bold",
                    isPos ? "text-emerald-400" : isNeg ? "text-rose-400" : "text-slate-400"
                  )}>
                    {isPos ? <TrendingUp className="h-3 w-3" /> : isNeg ? <Activity className="h-3 w-3" /> : null}
                    {snap.currentValue.toFixed(1)}
                  </div>
                )}
              </button>
            </MotionDiv>
          );
        })}
      </div>
    </MotionDiv>
  );
}

// ─── Indicators Grid ──────────────────────────────────────────────────────────

function IndicatorsGrid({
  snapshots,
  allIndicators,
  category,
  favorites,
  onFavorite,
}: {
  snapshots: IndicatorSnapshot[];
  allIndicators: MarketIndicator[];
  category: string;
  favorites: Set<string>;
  onFavorite: (id: string) => void;
}) {
  // Filter by category
  const filteredMeta = category === "all"
    ? allIndicators
    : allIndicators.filter((ind) => {
        // Map some aliases
        if (category === "Moving Averages") return ind.id === "sma" || ind.id === "ema" || ind.type === "trend";
        return ind.category === category;
      });

  // Map to snapshots; use a generated snapshot for non-popular ones
  const items = filteredMeta.map((meta, i) => {
    const snap = snapshots.find((s) => s.id === meta.id);
    if (!snap) return null;
    return { snap, index: i };
  }).filter(Boolean) as { snap: IndicatorSnapshot; index: number }[];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-violet-400/50" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">No indicators in this category</p>
        <p className="text-xs text-muted-foreground/60">Try selecting a different filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(({ snap, index }) => (
        <IndicatorCard
          key={snap.id}
          snap={snap}
          index={index}
          isFavorited={favorites.has(snap.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}

// ─── Main Page Client Component ──────────────────────────────────────────────

export function IndicatorsPageClient({
  snapshots,
  allIndicators,
}: {
  snapshots: IndicatorSnapshot[];
  allIndicators: MarketIndicator[];
}) {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  // Load favorites from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("tradex_indicator_favorites");
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {
      // ignore
    }
  }, []);

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try {
        localStorage.setItem("tradex_indicator_favorites", JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">

      {/* ── HERO ── */}
      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden border border-white/8 bg-card/30 backdrop-blur-xl"
      >
        {/* Background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(139,92,246,0.08),transparent_70%)]" />
        </div>

        <div className="relative px-6 pt-12 pb-10 md:px-12 md:pt-16 md:pb-14 space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400">
              <Sparkles className="h-3 w-3" />
              AI-Powered Market Intelligence
            </span>
          </div>

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Market Indicators
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Institutional-grade technical &amp; macroeconomic indicators with real-time AI synthesis,
              signal detection, and confidence scoring.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <EnhancedSearchBar />
          </div>

          {/* Stat ticker */}
          <div className="flex justify-center">
            <StatTicker snapshots={snapshots} />
          </div>
        </div>
      </MotionDiv>

      {/* ── MARKET SNAPSHOT ── */}
      <MarketSnapshot snapshots={snapshots} />

      {/* ── FEATURED ── */}
      <FeaturedSection snapshots={snapshots} />

      {/* ── POPULAR INDICATORS (scrolling ticker) ── */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold uppercase tracking-widest">Live Ticker</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <LiveTicker snapshots={snapshots} />
      </MotionDiv>

      {/* ── EXPLORE SECTION ── */}
      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
              <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Explore Indicators</h2>
              <p className="text-[11px] text-muted-foreground">Filter by category</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare mode coming soon</span>
          </div>
        </div>

        {/* Category chips */}
        <CategoryChips active={activeCategory} onChange={setActiveCategory} />

        {/* Grid */}
        <IndicatorsGrid
          snapshots={snapshots}
          allIndicators={allIndicators}
          category={activeCategory}
          favorites={favorites}
          onFavorite={handleFavorite}
        />
      </MotionDiv>
    </div>
  );
}

// ─── Live Ticker Strip ────────────────────────────────────────────────────────

function LiveTicker({ snapshots }: { snapshots: IndicatorSnapshot[] }) {
  const router = useRouter();

  const items = snapshots.map((snap) => {
    const meta = getIndicatorMeta(snap.id);
    const isPos = snap.trend === "Bullish";
    const isNeg = snap.trend === "Bearish";
    return { snap, meta, isPos, isNeg };
  });

  const content = items.map(({ snap, meta, isPos, isNeg }) => (
    <button
      key={snap.id}
      type="button"
      onClick={() => router.push(`/dashboard/indicators/${snap.id}`)}
      className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-card/50 backdrop-blur-sm px-3.5 py-2.5 hover:border-violet-500/30 hover:bg-card/70 transition-all duration-200 group shrink-0"
    >
      <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 text-[9px] font-bold shrink-0">
        {(meta?.shortName ?? snap.id).slice(0, 2)}
      </div>
      <div className="text-left">
        <p className="text-xs font-bold">{meta?.shortName ?? snap.id.toUpperCase()}</p>
        <p className="text-[10px] text-muted-foreground">{snap.currentValue.toFixed(2)}</p>
      </div>
      <div className={cn(
        "flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1",
        isPos ? "bg-emerald-500/10 text-emerald-400" :
        isNeg ? "bg-rose-500/10 text-rose-400" :
        "bg-slate-500/10 text-slate-400"
      )}>
        {isPos ? <TrendingUp className="h-2.5 w-2.5" /> : isNeg ? <Activity className="h-2.5 w-2.5" /> : null}
        <span className="ml-0.5">{snap.signal}</span>
      </div>
    </button>
  ));

  return (
    <>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_80px,black_calc(100%-80px),transparent_100%)]">
        <div className="flex w-max animate-ticker gap-3">
          <div className="flex gap-3">{content}</div>
          <div className="flex gap-3">{content}</div>
        </div>
      </div>
    </>
  );
}
