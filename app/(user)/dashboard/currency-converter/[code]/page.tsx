import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrencyDetail, getCurrencyPairDetail } from "@/services/currency-converter-data";
import { CurrencyDetailView } from "@/components/currency-converter/CurrencyDetailView";
import { CurrencyCharts } from "@/components/currency-converter/CurrencyCharts";

// Next.js 15+ dynamic params handling
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).toUpperCase();
  const detail = getCurrencyDetail(decodedCode);

  if (!detail) {
    return { title: "Currency Not Found" };
  }

  return {
    title: `${detail.name} (${detail.code}) Exchange Rate & Analysis | TradeX`,
    description: `Detailed analysis, historical performance, and AI outlook for ${detail.name}.`,
  };
}

export default async function CurrencyDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).toUpperCase();
  
  const currencyDetail = getCurrencyDetail(decodedCode);

  if (!currencyDetail) {
    notFound();
  }

  // To show charts, we can grab the historical data of this currency against USD (if not USD) or EUR (if USD).
  const targetCode = decodedCode === "USD" ? "EUR" : "USD";
  const pairDetail = getCurrencyPairDetail(decodedCode, targetCode);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/currency-converter"
          className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Converter
        </Link>
      </div>

      <CurrencyDetailView currency={currencyDetail} />
      
      {pairDetail && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Performance ({pairDetail.pair})
          </h2>
          <CurrencyCharts data={pairDetail.historicalData} />
        </div>
      )}
    </div>
  );
}
