"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";

const events = [
  { time: "Today, 14:00", title: "US Core CPI (MoM)", impact: "High", actual: "--", forecast: "0.3%", prev: "0.4%" },
  { time: "Tomorrow, 19:30", title: "Fed Interest Rate Decision", impact: "High", actual: "--", forecast: "5.50%", prev: "5.50%" },
  { time: "Wed, 08:30", title: "Eurozone GDP Growth", impact: "Medium", actual: "--", forecast: "0.1%", prev: "0.0%" },
  { time: "Thu, 10:00", title: "RBI Policy Announcement", impact: "High", actual: "--", forecast: "6.50%", prev: "6.50%" },
];

export function EconomicCalendar() {
  return (
    <section className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-5 h-5 text-sky-400" />
        <h2 className="text-lg font-semibold text-white tracking-tight">Economic Calendar</h2>
      </div>

      <div className="dash-v2-card p-4 flex flex-col gap-2 h-full">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default"
          >
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <Clock className="w-3.5 h-3.5" /> {event.time}
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${event.impact === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {event.impact === 'High' && <AlertCircle className="w-3 h-3" />} {event.impact}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-white group-hover:text-sky-100 transition-colors leading-tight">{event.title}</h3>
            
            <div className="flex items-center gap-6 mt-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Forecast</span>
                <span className="text-xs font-medium text-white/90">{event.forecast}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Previous</span>
                <span className="text-xs font-medium text-white/90">{event.prev}</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="mt-auto pt-4 pb-1 px-1">
           <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors border border-white/10">
            View Full Calendar
          </button>
        </div>
      </div>
    </section>
  );
}
