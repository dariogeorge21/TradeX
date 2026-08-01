"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

const sectors = [
  { name: "Technology", weight: "28%", change: "+2.4%", color: "bg-emerald-500", size: "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" },
  { name: "Finance", weight: "14%", change: "+1.1%", color: "bg-emerald-400", size: "col-span-2 row-span-1 sm:col-span-1 sm:row-span-2" },
  { name: "Healthcare", weight: "13%", change: "-0.5%", color: "bg-red-400", size: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1" },
  { name: "Consumer", weight: "11%", change: "+0.8%", color: "bg-emerald-500/80", size: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1" },
  { name: "Energy", weight: "4%", change: "-1.8%", color: "bg-red-500", size: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1" },
  { name: "Utilities", weight: "3%", change: "-0.2%", color: "bg-red-400/80", size: "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1" },
];

export function MarketHeatmap() {
  return (
    <section className="col-span-12 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <LayoutGrid className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Sector Heatmap</h2>
        <Link href="/dashboard/screener" className="ml-auto text-xs font-medium text-muted-foreground hover:text-white transition-colors">
          Full Heatmap
        </Link>
      </div>

      <div className="dash-v2-card p-4 h-[400px] sm:h-[300px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 gap-2 h-full">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 0.98 }}
              className={`${sector.size} ${sector.color} rounded-xl p-3 flex flex-col justify-between cursor-pointer overflow-hidden relative group`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              <div className="relative z-10">
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{sector.name}</span>
                <p className="text-[10px] text-white/70 font-medium">{sector.weight} Wgt</p>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">{sector.change}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
