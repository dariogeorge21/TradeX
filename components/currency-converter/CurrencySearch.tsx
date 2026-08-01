"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_CURRENCIES } from "@/services/currency-converter-data";

export function CurrencySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCurrencies = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return ALL_CURRENCIES.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.code.toLowerCase().includes(lowerQuery) ||
        c.country.toLowerCase().includes(lowerQuery) ||
        c.symbol.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to 10 results
  }, [query]);

  const handleSelect = (code: string) => {
    setQuery("");
    setIsFocused(false);
    router.push(`/dashboard/currency-converter/${code}`);
  };

  return (
    <div className="relative w-full max-w-xl" ref={containerRef}>
      <div
        className={`relative flex items-center bg-zinc-900/50 backdrop-blur-md border rounded-xl overflow-hidden transition-colors ${
          isFocused ? "border-emerald-500/50" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="pl-4 pr-3 text-zinc-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search by currency name, code, or country..."
          className="flex-1 bg-transparent py-3 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {filteredCurrencies.length > 0 ? (
              <ul className="max-h-[300px] overflow-y-auto p-2">
                {filteredCurrencies.map((currency) => (
                  <li key={currency.code}>
                    <button
                      onClick={() => handleSelect(currency.code)}
                      className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-full text-xl">
                        {currency.flag}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                            {currency.code}
                          </span>
                          <span className="text-sm text-zinc-500">{currency.symbol}</span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">
                          {currency.name} &bull; {currency.country}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-zinc-500">
                No currencies found for &quot;{query}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
