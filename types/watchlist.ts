export type AssetType = 'stock' | 'crypto' | 'forex' | 'mutual_fund';

export interface WatchlistStats {
  totalStocks: number;
  todayWinners: number;
  todayLosers: number;
  averageDailyChange: number;
  aiWatchScore: number;
}

export interface WatchlistFilters {
  searchQuery: string;
  assetType?: AssetType;
  sortBy: WatchlistSortOption;
}

export type WatchlistSortOption = 
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'highest_price'
  | 'lowest_price'
  | 'highest_gain'
  | 'highest_loss'
  | 'most_volatile'
  | 'ai_score';

export interface WatchlistItem {
  id: string;          // Watchlist entry ID
  userId: string;
  symbol: string;
  assetType: AssetType;
  createdAt: string;
  updatedAt: string;
  
  // Market data (hydrated dynamically, not stored in watchlists DB table)
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  aiSentiment?: 'Bullish' | 'Bearish' | 'Neutral';
  aiScore?: number;
  sparkline?: number[];
  exchange?: string;
  sector?: string;
  industry?: string;
}
