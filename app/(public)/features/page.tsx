"use client";

import { motion } from "framer-motion";
import { MessageSquare, ShieldAlert, BarChart3, TrendingUp, Zap, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Interactive AI Chat",
    description: "Ask anything about your portfolio or the market. Get instant, plain-language answers backed by real-time data.",
    icon: MessageSquare,
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-br from-indigo-500/10 to-transparent",
    border: "border-indigo-500/20",
  },
  {
    title: "Risk Assessment",
    description: "AI evaluates stocks and assigns dynamic risk levels (Low, Medium, High).",
    icon: ShieldAlert,
    colSpan: "md:col-span-1",
    bg: "bg-gradient-to-br from-rose-500/10 to-transparent",
    border: "border-rose-500/20",
  },
  {
    title: "Market Sentiment",
    description: "Understand the overall market mood with AI-driven sentiment analysis.",
    icon: BarChart3,
    colSpan: "md:col-span-1",
    bg: "bg-gradient-to-br from-amber-500/10 to-transparent",
    border: "border-amber-500/20",
  },
  {
    title: "Real-time News",
    description: "Stay ahead with curated financial news relevant to your watchlist.",
    icon: Newspaper,
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-br from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20",
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            Powerful Features
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Everything you need to <span className="gradient-text-emerald">invest smarter</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-400 leading-relaxed"
          >
            TradeX replaces complex charts and jargon with intuitive, AI-driven insights, making market intelligence accessible to everyone.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                "group relative glass border border-white/[0.06] rounded-3xl p-8 hover:border-white/[0.12] transition-all duration-300 overflow-hidden",
                feature.colSpan,
                feature.bg
              )}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/[0.05] border", feature.border)}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Insights that actually make sense
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Instead of showing you a web of moving averages, our AI reads the data and tells you what it means. Get summaries of earnings reports, sentiment analysis, and risk factors in clear, plain language.
            </p>
            <ul className="space-y-4">
              {[
                "Natural Language Processing",
                "Real-time Data Integration",
                "Personalized Watchlist Alerts"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md relative z-10">
            <div className="glass border border-white/[0.08] rounded-2xl p-6 relative shadow-2xl">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-full">
                High Risk
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xl">
                  TSLA
                </div>
                <div>
                  <h4 className="font-bold text-white">Tesla, Inc.</h4>
                  <p className="text-neutral-400 text-sm">$175.22 <span className="text-rose-400">-2.4%</span></p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-emerald-400">AI Insight: </span>
                  Recent earnings report indicates lower margins. Sentiment is currently bearish due to supply chain concerns. Consider holding off on new positions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
