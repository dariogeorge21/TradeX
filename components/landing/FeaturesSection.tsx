"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, ShieldCheck, Newspaper, MessageSquare, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Mini bar chart for AI Analysis card ───────────────────────── */
function MiniBarChart() {
  const bars = [40, 65, 50, 80, 60, 90, 75, 95, 70, 88];
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
          style={{ height: `${h}%`, originY: 1 }}
          className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-emerald-400" : "bg-emerald-500/30"}`}
        />
      ))}
    </div>
  );
}

/* ─── Mini sparkline ─────────────────────────────────────────────── */
function SparkLine({ color = "#10b981", data }: { color?: string; data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`);
  const d = `M ${pts.join(" L ")}`;
  const fillD = `${d} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sf-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sf-${color.replace("#","")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Chat snippet ───────────────────────────────────────────────── */
function ChatSnippet() {
  const msgs = [
    { role: "user", text: "What's the risk level for Tesla?" },
    { role: "ai", text: "Tesla (TSLA) currently shows Medium Risk. Strong EV market position but high P/E ratio and margin pressure warrant caution. Recommend 5-8% portfolio allocation." },
  ];
  return (
    <div className="flex flex-col gap-2">
      {msgs.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "ai" && (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mr-2 mt-0.5">
              <BrainCircuit className="w-2.5 h-2.5 text-black" />
            </div>
          )}
          <div
            className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
              msg.role === "user"
                ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20 rounded-br-sm"
                : "bg-white/[0.04] text-neutral-300 border border-white/[0.07] rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-1.5 pl-7">
        <div className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ─── News items ─────────────────────────────────────────────────── */
function NewsItems() {
  const news = [
    { sector: "Technology", headline: "AI chip demand surges as cloud giants expand infrastructure", sentiment: "bullish", change: "+4.2%" },
    { sector: "Energy", headline: "Crude oil stabilizes after OPEC output decision", sentiment: "neutral", change: "+0.3%" },
    { sector: "Finance", headline: "Fed signals potential rate cut in Q4 amid cooling inflation", sentiment: "bullish", change: "+1.8%" },
  ];
  const sentimentColor = (s: string) => s === "bullish" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="flex flex-col gap-2">
      {news.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer">
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
            {item.sector}
          </span>
          <p className="text-[10px] text-neutral-400 leading-snug flex-1 line-clamp-2">{item.headline}</p>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${sentimentColor(item.sentiment)}`}>
            {item.change}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Animation variants ─────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

/* ─── Features Section ───────────────────────────────────────────── */
export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30 bg-indigo-500/8 text-indigo-400 mb-4">
            <BarChart3 className="w-3 h-3" />
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Everything You Need to{" "}
            <span className="gradient-text-emerald">Invest with Confidence</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            TradeX combines cutting-edge AI with real-time market data to give you the edge —
            without the complexity.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto"
        >
          {/* Card 1: AI Stock Analysis — LARGE (spans 2 cols on lg) */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="h-full glass-card border-white/[0.07] bg-transparent relative overflow-hidden group">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base font-semibold">AI Stock Analysis</CardTitle>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">
                      Complex charts translated into plain language
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "P/E Ratio", value: "28.4", hint: "Slightly high" },
                    { label: "52w High", value: "$198.2", hint: "Near peak" },
                    { label: "Debt/Equity", value: "0.31", hint: "Very low" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-2.5">
                      <div className="text-xs text-neutral-500 mb-1">{stat.label}</div>
                      <div className="text-sm font-bold text-white">{stat.value}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{stat.hint}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">Price History</span>
                    <div className="flex gap-1">
                      {["1W","1M","3M","1Y"].map((t) => (
                        <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-md cursor-pointer transition-colors ${t === "3M" ? "bg-emerald-500/20 text-emerald-400" : "text-neutral-600 hover:text-neutral-400"}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <MiniBarChart />
                </div>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
                  <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider mb-1">AI Summary</div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Apple shows strong fundamentals with consistent revenue growth, healthy margins, and low debt. The stock trades near its 52-week high but remains supported by robust services revenue expansion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Risk Assessment */}
          <motion.div variants={cardVariants}>
            <Card className="h-full glass-card border-white/[0.07] bg-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base font-semibold">Risk Assessment</CardTitle>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">
                      Visual risk levels at a glance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { risk: "Low Risk", desc: "Apple Inc. (AAPL)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", bar: "bg-emerald-500", pct: 75 },
                    { risk: "Medium Risk", desc: "Tesla Inc. (TSLA)", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", bar: "bg-amber-500", pct: 50 },
                    { risk: "High Risk", desc: "GameStop (GME)", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", bar: "bg-rose-500", pct: 90 },
                  ].map((item) => (
                    <div key={item.risk} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.09] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-neutral-400">{item.desc}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>{item.risk}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.bar}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Market Trends & News */}
          <motion.div variants={cardVariants}>
            <Card className="h-full glass-card border-white/[0.07] bg-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base font-semibold">Market Trends</CardTitle>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">
                      AI-summarized financial news
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {["Tech", "Energy", "Healthcare", "Finance", "EV"].map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:border-indigo-500/30 hover:text-indigo-400 cursor-pointer transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-neutral-500 mb-1.5">
                      <span>Sector Performance (Today)</span>
                    </div>
                    <SparkLine color="#6366f1" data={[30, 45, 38, 60, 52, 70, 65, 80]} />
                  </div>
                  <NewsItems />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4: AI Market Chat — WIDE (spans 2 cols on lg) */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="h-full glass-card border-white/[0.07] bg-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-base font-semibold">AI Market Chat</CardTitle>
                    <CardDescription className="text-neutral-500 text-xs mt-0.5">
                      Ask anything — from analyzing Tesla to explaining RSI
                    </CardDescription>
                  </div>
                  <span className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live AI
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ChatSnippet />
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] mt-1">
                  <input
                    readOnly
                    value="Explain what RSI means for NVDA..."
                    className="flex-1 bg-transparent text-xs text-neutral-500 outline-none placeholder:text-neutral-700 cursor-default"
                  />
                  <button className="shrink-0 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center hover:bg-emerald-400 transition-colors">
                    <TrendingUp className="w-3 h-3 text-black" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
