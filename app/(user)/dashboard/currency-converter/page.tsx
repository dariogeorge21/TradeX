import React from "react";
import { Metadata } from "next";
import { CurrencySearch } from "@/components/currency-converter/CurrencySearch";
import { CurrencyConverterWidget } from "@/components/currency-converter/CurrencyConverterWidget";
import { ExchangeRateTable } from "@/components/currency-converter/ExchangeRateTable";
import { CurrencyHeatmap } from "@/components/currency-converter/CurrencyHeatmap";

export const metadata: Metadata = {
  title: "Currency Converter & Exchange Rates | TradeX",
  description: "Real-time currency converter, live exchange rates, and global currency performance.",
};

export default function CurrencyConverterDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      
      {/* Header & Search */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Currency Converter</h2>
          <p className="text-zinc-400 text-lg">
            Live exchange rates, historical performance, and global currency insights.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex-1 flex justify-end">
          <CurrencySearch />
        </div>
      </div>

      {/* Main Converter Widget */}
      <CurrencyConverterWidget />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap (Takes up 1 column on large screens) */}
        <div className="lg:col-span-1">
          <CurrencyHeatmap />
        </div>

        {/* Exchange Rate Table (Takes up 2 columns) */}
        <div className="lg:col-span-2">
          <ExchangeRateTable />
        </div>

      </div>

    </div>
  );
}
