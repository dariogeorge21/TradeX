import { Metadata } from "next";
import { getWatchlist } from "@/app/actions/watchlist";
import { WatchlistView } from "./WatchlistView";
import { WatchlistItem, WatchlistStats } from "@/types/watchlist";

export const metadata: Metadata = {
  title: "Watchlist — TradeX",
  description: "Monitor your favorite assets and track AI sentiment.",
};

// Mock function to hydrate DB rows with real-time market data
// In a real production app with a bulk endpoint, you would fetch this from your data provider
function hydrateWithMarketData(dbItems: any[]): WatchlistItem[] {
  return dbItems.map((item) => {
    // Generate deterministic pseudo-random data based on symbol length and char codes
    const seed = item.symbol.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const basePrice = 10 + (seed % 900);
    const isPositive = seed % 2 === 0;
    const changePercent = (seed % 100) / 10 * (isPositive ? 1 : -1);
    const change = basePrice * (changePercent / 100);
    
    // Generate simple sparkline
    const sparkline = Array.from({ length: 20 }, (_, i) => {
      const volatility = (seed % 10) / 100;
      const trend = isPositive ? i * volatility : -i * volatility;
      return basePrice + trend + (Math.random() - 0.5) * basePrice * 0.05;
    });

    const aiSentiments: ('Bullish' | 'Bearish' | 'Neutral')[] = ['Bullish', 'Bearish', 'Neutral'];
    
    return {
      id: item.id,
      userId: item.user_id,
      symbol: item.symbol,
      assetType: item.asset_type,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      name: `${item.symbol} Corp`,
      price: basePrice,
      change,
      changePercent,
      marketCap: (seed * 1000000000) % 2000000000000,
      volume: seed * 100000,
      aiSentiment: aiSentiments[seed % 3],
      aiScore: 40 + (seed % 60),
      sparkline,
    };
  });
}

function calculateStats(items: WatchlistItem[]): WatchlistStats {
  if (items.length === 0) {
    return {
      totalStocks: 0,
      todayWinners: 0,
      todayLosers: 0,
      averageDailyChange: 0,
      aiWatchScore: 0,
    };
  }

  const winners = items.filter(i => (i.changePercent || 0) >= 0).length;
  const totalChange = items.reduce((acc, curr) => acc + (curr.changePercent || 0), 0);
  const totalScore = items.reduce((acc, curr) => acc + (curr.aiScore || 0), 0);

  return {
    totalStocks: items.length,
    todayWinners: winners,
    todayLosers: items.length - winners,
    averageDailyChange: totalChange / items.length,
    aiWatchScore: totalScore / items.length,
  };
}

export default async function WatchlistPage() {
  const { data: dbItems, success } = await getWatchlist();
  
  if (!success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Please sign in to view your watchlist.
      </div>
    );
  }

  const hydratedItems = hydrateWithMarketData(dbItems || []);
  const stats = calculateStats(hydratedItems);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <WatchlistView initialItems={hydratedItems} stats={stats} />
    </div>
  );
}
