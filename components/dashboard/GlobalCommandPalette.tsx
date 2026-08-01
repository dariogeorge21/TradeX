"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search, TrendingUp, Newspaper, Lightbulb, Bitcoin } from "lucide-react";
import { useRouter } from "next/navigation";

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

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 w-full md:w-80 bg-white/5 border border-white/10 rounded-full text-muted-foreground text-sm hover:bg-white/10 transition-colors group"
      >
        <Search className="w-4 h-4 group-hover:text-white transition-colors" />
        <span className="group-hover:text-white transition-colors">Search markets, AI...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 cmd-palette-backdrop">
          <Command.Dialog 
            open={open} 
            onOpenChange={setOpen} 
            label="Global Command Menu"
            className="w-full max-w-2xl cmd-palette-content rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center border-b border-white/10 px-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Command.Input 
                autoFocus
                placeholder="Search stocks, crypto, news, or ask AI..." 
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground h-16 px-4 outline-none text-lg"
              />
              <button 
                onClick={() => setOpen(false)} 
                className="text-xs bg-white/10 px-2 py-1 rounded-md text-muted-foreground hover:text-white transition-colors border border-white/10"
              >
                ESC
              </button>
            </div>
            
            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Stocks & ETFs" className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                <Command.Item 
                  onSelect={() => { setOpen(false); router.push("/dashboard/stocks/AAPL"); }}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                    AAPL
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base">Apple Inc.</span>
                    <span className="text-xs text-muted-foreground">Technology • $189.43</span>
                  </div>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setOpen(false); router.push("/dashboard/stocks/NVDA"); }}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    NVDA
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base">NVIDIA Corp</span>
                    <span className="text-xs text-muted-foreground">Technology • $892.10</span>
                  </div>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Crypto" className="text-xs font-semibold text-muted-foreground px-3 pt-4 pb-2 uppercase tracking-wider">
                <Command.Item 
                  onSelect={() => { setOpen(false); router.push("/dashboard/crypto/BTC"); }}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Bitcoin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base">Bitcoin</span>
                    <span className="text-xs text-muted-foreground">BTC • $68,432</span>
                  </div>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Quick Actions" className="text-xs font-semibold text-muted-foreground px-3 pt-4 pb-2 uppercase tracking-wider border-t border-white/5 mt-2">
                <Command.Item className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Ask AI Assistant</span>
                </Command.Item>
                <Command.Item className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Market Screener</span>
                </Command.Item>
                <Command.Item className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/10 text-white text-sm mt-1 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Latest Market News</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command.Dialog>
        </div>
      )}
    </>
  );
}
