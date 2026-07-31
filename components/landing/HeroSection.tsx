"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, TrendingDown, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

/* ─── Mini Sparkline SVG ─────────────────────────────────────────── */
function MiniSparkline({ trend = "up" }: { trend?: "up" | "down" }) {
  const upPath = "M 0 40 L 15 32 L 30 36 L 45 22 L 60 18 L 75 14 L 90 8 L 100 4";
  const downPath = "M 0 10 L 15 18 L 30 14 L 45 28 L 60 32 L 75 36 L 90 42 L 100 46";
  const color = trend === "up" ? "#10b981" : "#f43f5e";
  const fillId = trend === "up" ? "sparkline-fill-up" : "sparkline-fill-down";

  return (
    <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${trend === "up" ? upPath : downPath} L 100 50 L 0 50 Z`}
        fill={`url(#${fillId})`}
      />
      <path
        d={trend === "up" ? upPath : downPath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Hero Bento Mockup ──────────────────────────────────────────── */
function HeroBentoMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative w-full max-w-md mx-auto animate-float-slow"
    >
      {/* Background glow */}
      <div className="absolute -inset-12 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute -inset-8 bg-indigo-500/5 rounded-full blur-2xl" />

      <div className="relative grid grid-cols-5 grid-rows-5 gap-2.5 p-3">
        {/* Main Stock Card — spans 5 cols, 2 rows */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="col-span-5 row-span-2 glass-card rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                AAPL
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Apple Inc.</div>
                <div className="text-[10px] text-neutral-500">NASDAQ • Technology</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-2.5 h-2.5" />
              Low Risk
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xl font-bold text-white">$189.40</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <TrendingUp className="w-2.5 h-2.5" />
                +1.24% today
              </div>
            </div>
            <div className="w-28 h-10">
              <MiniSparkline trend="up" />
            </div>
          </div>
        </motion.div>

        {/* Risk Badge Card — 3 cols, 2 rows */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="col-span-3 row-span-2 glass-card rounded-2xl p-3 flex flex-col gap-2"
        >
          <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Risk Level</div>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "Low Risk", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", bar: "bg-emerald-500", w: "w-2/3" },
              { label: "Med Risk", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", bar: "bg-amber-500", w: "w-2/5" },
              { label: "High Risk", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", bar: "bg-rose-500", w: "w-1/5" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border whitespace-nowrap ${item.color}`}>
                  {item.label}
                </span>
                <div className="flex-1 h-1 rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${item.bar} ${item.w}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Sentiment — 2 cols, 2 rows */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="col-span-2 row-span-2 glass-card rounded-2xl p-3 flex flex-col"
        >
          <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-1">Sentiment</div>
          <div className="flex-1">
            <MiniSparkline trend="up" />
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">Bullish ↑</div>
        </motion.div>

        {/* AI Chat Bubble — 5 cols, 1 row */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="col-span-5 row-span-1 glass-card rounded-2xl p-3 flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-2.5 h-2.5 text-black" />
          </div>
          <div className="text-[10px] text-neutral-300 leading-relaxed line-clamp-1">
            <span className="text-emerald-400 font-medium">AI: </span>
            Apple shows strong fundamentals with low debt ratio and consistent revenue growth...
          </div>
          <div className="w-1.5 h-3 bg-emerald-400 rounded-sm animate-blink shrink-0" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Floating Ticker Bar ────────────────────────────────────────── */
function TickerBar() {
  const tickers = [
    { symbol: "AAPL", price: "$189.40", change: "+1.24%", up: true },
    { symbol: "TSLA", price: "$247.80", change: "+3.15%", up: true },
    { symbol: "GOOGL", price: "$175.90", change: "-0.42%", up: false },
    { symbol: "MSFT", price: "$421.30", change: "+0.87%", up: true },
    { symbol: "NVDA", price: "$892.50", change: "+5.67%", up: true },
    { symbol: "AMZN", price: "$188.40", change: "-0.93%", up: false },
    { symbol: "META", price: "$536.20", change: "+2.34%", up: true },
    { symbol: "RELIANCE", price: "₹2,847", change: "+1.02%", up: true },
  ];
  const doubled = [...tickers, ...tickers];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.04] bg-white/[0.01] py-2">
      <div className="flex gap-8 animate-ticker whitespace-nowrap">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-neutral-300">{t.symbol}</span>
            <span className="text-xs text-neutral-500">{t.price}</span>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${t.up ? "text-emerald-400" : "text-rose-400"}`}>
              {t.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {t.change}
            </span>
            <span className="text-neutral-800">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Hero Section ──────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial glow orbs */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Ticker */}
      <TickerBar />

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <div className="flex flex-col gap-6">
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/8 text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Market Intelligence
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
              >
                Understand the{" "}
                <span className="gradient-text-hero">Stock Market</span>{" "}
                <br className="hidden sm:block" />
                in Seconds{" "}
                <span className="gradient-text-emerald">with AI</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl"
              >
                TradeX cuts through the noise. Instead of overwhelming charts and dense financial jargon,
                get{" "}
                <span className="text-neutral-200 font-medium">clear, AI-generated insights</span>{" "}
                on any stock — risk levels, market sentiment, and plain-language analysis.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  id="hero-cta-primary"
                  className="relative bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base h-12 px-8 overflow-hidden group/btn transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  asChild
                >
                  <Link href="/signup">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Your Free Analysis
                    <div className="absolute inset-0 animate-shimmer" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  id="hero-cta-demo"
                  className="border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/6 text-white font-medium text-base h-12 px-8 gap-2 transition-all duration-300 hover:-translate-y-0.5"
                  asChild
                >
                  <Link href="/features">
                    <Play className="w-4 h-4 text-emerald-400 mr-2" />
                    View Features
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 text-xs text-neutral-500"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Powered by GPT-4
                </span>
              </motion.div>
            </div>

            {/* Right — Bento Mockup */}
            <div className="flex justify-center lg:justify-end">
              <HeroBentoMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
