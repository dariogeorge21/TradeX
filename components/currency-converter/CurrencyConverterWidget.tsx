"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, Info } from "lucide-react";
import { motion } from "framer-motion";
import { ALL_CURRENCIES, generateLiveRate } from "@/services/currency-converter-data";

export function CurrencyConverterWidget() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [amount, setAmount] = useState<string>("1000");
  
  // Simulated live rate state
  const [rate, setRate] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update rate on currency change or interval
  useEffect(() => {
    const updateRate = () => {
      const exchangeData = generateLiveRate(baseCurrency, targetCurrency);
      setRate(exchangeData.rate);
      setLastUpdated(new Date());
    };

    updateRate(); // Initial fetch
    const interval = setInterval(updateRate, 5000); // Simulate live updates every 5s

    return () => clearInterval(interval);
  }, [baseCurrency, targetCurrency]);

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  const convertedAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return "0.00";
    return (parsedAmount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [amount, rate]);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col space-y-6">
        <h2 className="text-xl font-semibold text-white">Convert Currency</h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Base Currency Block */}
          <div className="flex-1 w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4 transition-colors focus-within:border-emerald-500/50">
            <label className="block text-xs font-medium text-zinc-500 mb-1">Amount</label>
            <div className="flex items-center gap-3">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="bg-transparent text-lg font-semibold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {ALL_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-2xl font-bold text-white focus:outline-none placeholder:text-zinc-600 w-full min-w-0"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwap}
            className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors z-10"
            aria-label="Swap currencies"
          >
            <ArrowUpDown className="h-5 w-5" />
          </motion.button>

          {/* Target Currency Block */}
          <div className="flex-1 w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4">
            <label className="block text-xs font-medium text-zinc-500 mb-1">Converted</label>
            <div className="flex items-center gap-3">
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="bg-transparent text-lg font-semibold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {ALL_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <div className="flex-1 text-right text-2xl font-bold text-emerald-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {convertedAmount}
              </div>
            </div>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-zinc-500 gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4" />
            <span>1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live rates updated at {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
