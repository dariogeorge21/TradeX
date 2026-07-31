"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  BarChart2,
  Users,
  Star,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const audiences = [
  {
    icon: GraduationCap,
    label: "Beginner Investors",
    description: "Start your investing journey with clear, jargon-free AI explanations",
    color: "emerald",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    icon: TrendingUp,
    label: "Swing Traders",
    description: "Get quick risk assessments and sentiment analysis for short-term plays",
    color: "amber",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    icon: BarChart2,
    label: "Long-Term Investors",
    description: "Evaluate fundamentals and multi-year outlooks with AI-powered deep analysis",
    color: "indigo",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    icon: GraduationCap,
    label: "Students",
    description: "Learn market concepts interactively — ask the AI to explain anything",
    color: "teal",
    iconBg: "bg-teal-500/10 border-teal-500/20",
    iconColor: "text-teal-400",
    badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Retail Investor",
    avatar: "SC",
    color: "from-emerald-400 to-teal-500",
    quote:
      "TradeX finally made investing make sense to me. I asked it to explain NVDA's risk profile and got a crystal-clear answer in seconds.",
    stars: 5,
  },
  {
    name: "Rajan Mehta",
    role: "Swing Trader",
    avatar: "RM",
    color: "from-indigo-400 to-purple-500",
    quote:
      "The AI risk assessment is spot on. I use it every morning to scan my watchlist before making any moves. Total game changer.",
    stars: 5,
  },
  {
    name: "Alex Rodriguez",
    role: "Finance Student",
    avatar: "AR",
    color: "from-amber-400 to-orange-500",
    quote:
      "Way better than any textbook. I ask TradeX about RSI, P/E ratios, whatever — and it explains everything like I'm actually smart.",
    stars: 5,
  },
];

export function AudienceSection() {
  return (
    <section id="audience" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Gradient panel background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.025] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 mb-4">
            <Users className="w-3 h-3" />
            Who It's For
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Built for Every Type of{" "}
            <span className="gradient-text-emerald">Investor</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            Whether you're just starting out or you're a seasoned trader, TradeX speaks your language.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {audiences.map((audience, i) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${audience.iconBg}`}>
                  <Icon className={`w-5 h-5 ${audience.iconColor}`} />
                </div>
                <div>
                  <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-2 ${audience.badgeClass}`}>
                    {audience.label}
                  </span>
                  <p className="text-sm text-neutral-400 leading-relaxed mt-1">{audience.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="border-t border-white/[0.06] pt-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm text-neutral-500 uppercase tracking-widest font-medium">What people are saying</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              >
                <Quote className="w-5 h-5 text-emerald-400/50" />
                <p className="text-sm text-neutral-300 leading-relaxed flex-1">{t.quote}</p>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
