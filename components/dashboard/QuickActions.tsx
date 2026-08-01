"use client";

import { motion, Variants } from "framer-motion";
import {
  BarChart2,
  GitCompare,
  Briefcase,
  LineChart,
  Sparkles,
  Eye,
  FileText
} from "lucide-react";
import Link from "next/link";

const actions = [
  { icon: BarChart2, label: "Analyze", color: "text-blue-400", bg: "bg-blue-500/10", href: "/dashboard/stocks" },
  { icon: GitCompare, label: "Compare", color: "text-orange-400", bg: "bg-orange-500/10", href: "/dashboard/compare" },
  { icon: Briefcase, label: "Portfolio AI", color: "text-purple-400", bg: "bg-purple-500/10", href: "/dashboard/portfolio" },
  { icon: LineChart, label: "Screener", color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/dashboard/screener" },
  { icon: Sparkles, label: "Ask AI", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", href: "/dashboard/chatbot" },
  { icon: Eye, label: "Watchlist", color: "text-amber-400", bg: "bg-amber-500/10", href: "/dashboard/watchlist" },
  { icon: FileText, label: "Research", color: "text-sky-400", bg: "bg-sky-500/10", href: "/dashboard/research" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function QuickActions() {
  return (
    <section className="mb-8" aria-label="Quick Actions">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">Quick Actions</h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex overflow-x-auto pb-4 pt-2 -mt-2 px-1 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10"
      >
        {actions.map((action) => (
          <Link key={action.label} href={action.href} className="snap-start shrink-0 outline-none">
            <motion.div
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="dash-v2-card flex flex-col items-center justify-center p-4 w-[110px] h-[110px] cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className={`p-3 rounded-xl mb-3 transition-colors ${action.bg} group-hover:bg-opacity-20`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
