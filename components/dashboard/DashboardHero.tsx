"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";

interface DashboardHeroProps {
  displayName: string;
}

export function DashboardHero({ displayName }: DashboardHeroProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (!time) return "Good Day";
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedTime = time?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="dash-v2-hero p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
    >
      <div className="flex flex-col gap-2 z-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
          <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            US Markets Open
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {formattedTime || "--:--"}
          </span>
          <span className="hidden sm:inline-block text-white/20">•</span>
          <span className="hidden sm:inline-block">{formattedDate || "..."}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          {getGreeting()},{" "}
          <span className="text-gradient-premium">{displayName}</span>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="z-10 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 md:max-w-md w-full hover-glow-ai relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center justify-between">
              AI Morning Brief
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tesla earnings are expected today. Bitcoin is up <span className="text-emerald-400 font-medium">3.1%</span>. NVIDIA continues strong momentum. Two companies in your watchlist have unusual volume.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
