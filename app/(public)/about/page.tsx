"use client";

import { motion } from "framer-motion";
import { BrainCircuit, LineChart, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const values = [
  {
    title: "AI-First Insights",
    description: "We believe in simplifying complex market data through natural language and actionable intelligence.",
    icon: BrainCircuit,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    title: "Data-Driven Precision",
    description: "Every insight is backed by real-time market data, ensuring you make decisions with confidence.",
    icon: LineChart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Simplicity at Core",
    description: "No more overwhelming charts. We present information in a clear, digestible format for everyone.",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "Uncompromising Security",
    description: "Your watchlists, chats, and personal data are protected with industry-leading encryption and security.",
    icon: ShieldCheck,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Our Mission
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Demystifying the market with <span className="gradient-text-emerald">AI intelligence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-400 leading-relaxed"
          >
            We built TradeX because we were tired of staring at confusing charts. Our platform translates complex financial data into plain-language insights, empowering everyone to invest with clarity and confidence.
          </motion.p>
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12 backdrop-blur-md mb-24 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-neutral-400 leading-relaxed mb-6 text-lg">
              The stock market has historically been gatekept by jargon and complex technical analysis. We saw an opportunity to leverage advanced Large Language Models (LLMs) to bridge this gap. TradeX was born from a simple idea: what if you could just ask your portfolio how it's doing?
            </p>
            <p className="text-neutral-400 leading-relaxed text-lg">
              Today, TradeX processes millions of data points, real-time news, and market sentiment to deliver instant, actionable insights. Whether you are tracking a single tech stock or monitoring an entire sector, our AI acts as your personal financial analyst—available 24/7.
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <div className="mb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              The principles that guide our product development and how we serve our users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative glass border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 border", value.bg, value.border, value.color)}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
