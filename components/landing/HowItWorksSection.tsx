"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, BrainCircuit, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search Any Stock",
    description:
      "Simply type any stock ticker or company name — Apple, Tesla, Reliance, NVDA. TradeX fetches real-time data instantly.",
    examples: ["AAPL", "TSLA", "RELIANCE", "NVDA"],
    color: "emerald",
    iconBg: "bg-emerald-500/10 border-emerald-500/25",
    iconColor: "text-emerald-400",
    glowColor: "bg-emerald-500/10",
    number: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "Get Instant AI Analysis",
    description:
      "Our AI processes complex financial data and delivers plain-language insights: risk level, sentiment score, key metrics, and actionable summaries.",
    examples: ["Risk Level", "Price Target", "AI Summary", "Sentiment"],
    color: "indigo",
    iconBg: "bg-indigo-500/10 border-indigo-500/25",
    iconColor: "text-indigo-400",
    glowColor: "bg-indigo-500/10",
    number: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Make Confident Decisions",
    description:
      "Armed with clear insights and risk assessments, make smarter investment decisions — whether you're a beginner or a seasoned trader.",
    examples: ["Buy Signal", "Hold Strategy", "Risk Alert", "Portfolio Fit"],
    color: "teal",
    iconBg: "bg-teal-500/10 border-teal-500/25",
    iconColor: "text-teal-400",
    glowColor: "bg-teal-500/10",
    number: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-500/30 bg-teal-500/8 text-teal-400 mb-4">
            <CheckCircle2 className="w-3 h-3" />
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            From Question to{" "}
            <span className="gradient-text-emerald">Insight in Seconds</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            No finance degree needed. TradeX makes professional-grade stock analysis accessible to everyone.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 mx-auto w-2/3 h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-gradient-to-r from-emerald-500/40 via-indigo-500/40 to-teal-500/40"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.55, delay: i * 0.15 + 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="relative group"
                >
                  {/* Arrow connector (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-10 z-10 items-center">
                      <ArrowRight className="w-4 h-4 text-neutral-700" />
                    </div>
                  )}

                  <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 h-full hover:border-white/15 transition-all duration-300">
                    {/* Step indicator + Icon */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.iconBg}`}>
                        <Icon className={`w-5 h-5 ${step.iconColor}`} />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${step.number}`}>
                        Step {step.step}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white leading-snug">{step.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-400 leading-relaxed">{step.description}</p>

                    {/* Example tags */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {step.examples.map((ex) => (
                        <span
                          key={ex}
                          className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-neutral-400"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
