"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Search } from "lucide-react";
import { ExchangeRate } from "@/types/currency-converter";
import { getPopularPairs } from "@/services/currency-converter-data";
import { ALL_CURRENCIES } from "@/services/currency-converter-data";

export function ExchangeRateTable() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof ExchangeRate | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [filterType, setFilterType] = useState<string>("All");

  useEffect(() => {
    // Initial fetch
    setRates(getPopularPairs());
    
    // Simulate live updates
    const interval = setInterval(() => {
      setRates(getPopularPairs());
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: keyof ExchangeRate) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedRates = useMemo(() => {
    let result = [...rates];

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => r.pair.toLowerCase().includes(s));
    }

    // Type filter
    if (filterType !== "All") {
      result = result.filter(r => {
        const baseCur = ALL_CURRENCIES.find(c => c.code === r.baseCurrency);
        const targetCur = ALL_CURRENCIES.find(c => c.code === r.targetCurrency);
        return baseCur?.type === filterType || targetCur?.type === filterType;
      });
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof ExchangeRate];
        const bVal = b[sortConfig.key as keyof ExchangeRate];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rates, search, sortConfig, filterType]);

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
      
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Live Exchange Rates
          </h3>
          <p className="text-sm text-zinc-400 mt-1">Real-time quotes for popular currency pairs</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-48 bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Major">Major</option>
            <option value="Minor">Minor</option>
            <option value="Exotic">Exotic</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-900/50 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('pair')}>
                Pair {sortConfig.key === 'pair' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('rate')}>
                Last Rate {sortConfig.key === 'rate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors text-right" onClick={() => handleSort('changePercent')}>
                Change {sortConfig.key === 'changePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Day High</th>
              <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Day Low</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAndSortedRates.length > 0 ? (
              filteredAndSortedRates.map((rate, idx) => {
                const isPositive = rate.change >= 0;
                return (
                  <tr key={`${rate.pair}-${idx}`} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <span className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-zinc-950">
                          {ALL_CURRENCIES.find(c => c.code === rate.baseCurrency)?.flag}
                        </span>
                        <span className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs border border-zinc-950 z-10">
                          {ALL_CURRENCIES.find(c => c.code === rate.targetCurrency)?.flag}
                        </span>
                      </div>
                      {rate.pair}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-zinc-200">
                      {rate.rate.toFixed(4)}
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(rate.changePercent).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-500 font-mono hidden sm:table-cell">
                      {rate.dailyHigh.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-500 font-mono hidden sm:table-cell">
                      {rate.dailyLow.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/currency-converter/${rate.baseCurrency}`}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No matching pairs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
