"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ScreenerFilters = Record<string, any>;

export interface SavedScreener {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  filters: ScreenerFilters;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export async function saveScreener(data: { name: string; description?: string; filters: ScreenerFilters }) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("saved_screeners")
    .insert([
      {
        user_id: userData.user.id,
        name: data.name,
        description: data.description || "",
        filters: data.filters,
      },
    ]);

  if (error) {
    console.error("Error saving screener:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/screener");
  return { success: true };
}

export async function updateScreener(id: string, data: { name?: string; description?: string; filters?: ScreenerFilters }) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("saved_screeners")
    .update(data)
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error updating screener:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/screener");
  return { success: true };
}

export async function deleteScreener(id: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("saved_screeners")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error deleting screener:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/screener");
  return { success: true };
}

export async function favoriteScreener(id: string, is_favorite: boolean) {
  return updateScreener(id, { is_favorite } as any);
}

export async function getSavedScreeners() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", data: [] };
  }

  const { data, error } = await supabase
    .from("saved_screeners")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved screeners:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as SavedScreener[] };
}

export async function generateAISummary(filters: ScreenerFilters, resultCount: number) {
  // Mock AI Insights generation for now, ideally this would call a real LLM API
  // based on the applied filters.

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

  let summary = `Based on your current filters, we found ${resultCount} matching stocks. `;

  if (filters.sector) {
    summary += `The ${filters.sector} sector is showing strong momentum this week. `;
  }

  if (filters.marketCap === 'large') {
    summary += `Large cap stocks are currently favored by institutional investors as a safe haven. `;
  } else if (filters.marketCap === 'small') {
    summary += `Small cap stocks present higher volatility but significant growth opportunities in the current macroeconomic environment. `;
  }

  if (filters.peRatio && filters.peRatio < 15) {
    summary += `These companies appear fundamentally undervalued based on their P/E ratios. `;
  }

  if (filters.dividendYield && filters.dividendYield > 3) {
    summary += `This presents a solid opportunity for income-focused portfolios. `;
  }

  return {
    success: true,
    data: {
      summary,
      confidenceScore: Math.floor(Math.random() * 20) + 80, // 80-100
      topPicks: ["AAPL", "MSFT", "NVDA"].slice(0, Math.max(1, Math.floor(Math.random() * 3))),
      marketSentiment: Math.random() > 0.5 ? "Bullish" : "Neutral",
      riskLevel: "Moderate"
    }
  };
}

// Mock search function
export async function searchStocks(query: string, filters: ScreenerFilters) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 600));

  // Return some dummy data based on TradeX's likely structure
  return {
    success: true,
    data: [
      { id: "1", ticker: "AAPL", name: "Apple Inc.", price: 189.20, change: 1.25, volume: 45000000, marketCap: 2900000000000, sector: "Technology", pe: 28.5, aiScore: 92, signal: "Buy" },
      { id: "2", ticker: "MSFT", name: "Microsoft Corp.", price: 415.50, change: 0.85, volume: 22000000, marketCap: 3100000000000, sector: "Technology", pe: 35.2, aiScore: 88, signal: "Hold" },
      { id: "3", ticker: "NVDA", name: "NVIDIA Corp.", price: 125.10, change: 3.50, volume: 85000000, marketCap: 2800000000000, sector: "Technology", pe: 65.4, aiScore: 95, signal: "Strong Buy" },
      { id: "4", ticker: "JPM", name: "JPMorgan Chase", price: 205.30, change: -0.45, volume: 12000000, marketCap: 590000000000, sector: "Financial", pe: 11.5, aiScore: 78, signal: "Buy" },
      { id: "5", ticker: "V", name: "Visa Inc.", price: 275.80, change: 0.15, volume: 6500000, marketCap: 560000000000, sector: "Financial", pe: 29.8, aiScore: 82, signal: "Hold" },
      { id: "6", ticker: "JNJ", name: "Johnson & Johnson", price: 145.20, change: -1.10, volume: 9000000, marketCap: 350000000000, sector: "Healthcare", pe: 14.2, aiScore: 71, signal: "Hold" },
      { id: "7", ticker: "UNH", name: "UnitedHealth Group", price: 510.45, change: 1.80, volume: 4500000, marketCap: 470000000000, sector: "Healthcare", pe: 22.1, aiScore: 85, signal: "Buy" },
      { id: "8", ticker: "XOM", name: "Exxon Mobil", price: 115.60, change: 0.50, volume: 15000000, marketCap: 460000000000, sector: "Energy", pe: 13.5, aiScore: 75, signal: "Hold" },
      { id: "9", ticker: "PG", name: "Procter & Gamble", price: 165.90, change: 0.20, volume: 5500000, marketCap: 390000000000, sector: "Consumer", pe: 25.4, aiScore: 80, signal: "Buy" },
      { id: "10", ticker: "HD", name: "Home Depot", price: 345.10, change: -0.80, volume: 4000000, marketCap: 340000000000, sector: "Consumer", pe: 21.8, aiScore: 76, signal: "Hold" },
    ].filter(stock => !query || stock.ticker.toLowerCase().includes(query.toLowerCase()) || stock.name.toLowerCase().includes(query.toLowerCase()))
  };
}
