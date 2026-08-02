"use client";

import * as React from "react";
import { Command } from "cmdk";
import { 
  Search, TrendingUp, Newspaper, Lightbulb, Bitcoin,
  Home, Filter, LineChart, Star, PieChart, DollarSign,
  Activity, ArrowRightLeft, MessageSquare, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard Home", href: "/dashboard", icon: Home, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Market Screener", href: "/dashboard/screener", icon: Filter, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Stocks", href: "/dashboard/stocks", icon: LineChart, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { label: "Mutual Funds", href: "/dashboard/mutual-funds", icon: PieChart, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { label: "Crypto", href: "/dashboard/crypto", icon: Bitcoin, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { label: "Forex", href: "/dashboard/forex", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { label: "Currency Converter", href: "/dashboard/currency-converter", icon: ArrowRightLeft, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { label: "Market Indicators", href: "/dashboard/indicators", icon: Activity, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { label: "News", href: "/dashboard/news", icon: Newspaper, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { label: "AI Chat Assistant", href: "/dashboard/chatbot", icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
];

export function GlobalCommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 w-full md:w-[320px] bg-[#0A0E17]/60 hover:bg-[#111827]/80 border border-white/5 hover:border-white/10 rounded-full text-muted-foreground text-sm transition-all duration-300 group shadow-lg backdrop-blur-md"
      >
        <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="group-hover:text-white transition-colors flex-1 text-left font-medium">Search tools, markets...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          
          <Command.Dialog 
            open={open} 
            onOpenChange={setOpen} 
            label="Global Command Menu"
            className="relative w-full max-w-2xl bg-slate-950 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/5 cmd-palette-content"
          >
            <div className="flex items-center border-b border-white/10 px-4 py-2 bg-white/[0.02]">
              <Search className="w-5 h-5 text-primary mr-3" />
              <Command.Input 
                autoFocus
                placeholder="Search tools, pages, stocks, crypto..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground h-12 outline-none text-base font-medium"
              />
              <kbd className="hidden sm:inline-flex pointer-events-none h-6 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-xs font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
            
            <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <Command.Empty className="py-14 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-white">No results found.</p>
                <p className="text-xs text-muted-foreground mt-1">Try searching for a different keyword.</p>
              </Command.Empty>

              <Command.Group heading="Navigation & Tools" className="text-[10px] font-bold text-muted-foreground px-2 py-3 uppercase tracking-widest">
                {NAV_ITEMS.map((item) => (
                  <Command.Item 
                    key={item.href}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-xl ${item.bg} border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <item.icon className="w-[18px] h-[18px]" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-sm tracking-tight">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground">Go to {item.label.toLowerCase()}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/0 group-aria-selected:text-white/40 transition-colors" />
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Trending Markets" className="text-[10px] font-bold text-muted-foreground px-2 pt-4 pb-2 uppercase tracking-widest border-t border-white/5 mt-2">
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/dashboard/stocks/AAPL"))}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-[10px] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    AAPL
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight">Apple Inc.</span>
                    <span className="text-[11px] text-muted-foreground">Technology • $189.43</span>
                  </div>
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/dashboard/stocks/NVDA"))}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-[10px] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    NVDA
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight">NVIDIA Corp</span>
                    <span className="text-[11px] text-muted-foreground">Technology • $892.10</span>
                  </div>
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push("/dashboard/crypto/BTC"))}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Bitcoin className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight">Bitcoin</span>
                    <span className="text-[11px] text-muted-foreground">BTC • $68,432</span>
                  </div>
                </Command.Item>
              </Command.Group>
            </Command.List>
            
            <div className="border-t border-white/10 p-3 bg-white/[0.02] flex items-center justify-between">
              <div className="flex gap-5">
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <span className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 mr-1.5 font-mono text-[10px] font-medium shadow-sm">↑</span>
                  <span className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 mr-1.5 font-mono text-[10px] font-medium shadow-sm">↓</span>
                  Navigate
                </div>
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <span className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 mr-1.5 font-mono text-[10px] font-medium shadow-sm">↵</span>
                  Select
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                TradeX <span className="text-primary font-semibold">AI Search</span>
              </div>
            </div>
          </Command.Dialog>
        </div>
      )}
    </>
  );
}
