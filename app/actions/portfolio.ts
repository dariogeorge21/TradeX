'use server';

import { createClient } from '@/utils/supabase/server';
import { 
  PortfolioHolding, 
  PortfolioTransaction, 
  PortfolioGoal, 
  PortfolioStats,
  AIInsights
} from '@/types/portfolio';
import { revalidatePath } from 'next/cache';

// -- Mock Helpers (simulate market prices, since we don't have a real-time API hooked up)
function getMockCurrentPrice(ticker: string, averagePrice: number): number {
  // Generate a realistic but random price fluctuation between -10% and +20%
  const fluctuation = 1 + (Math.random() * 0.3 - 0.1); 
  return averagePrice * fluctuation;
}

// -- HOLDINGS --

export async function getPortfolioHoldings(): Promise<PortfolioHolding[]> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('portfolio_holdings')
    .select('*')
    .eq('user_id', userData.user.id);

  if (error) {
    console.error('Error fetching holdings:', error);
    return [];
  }

  // Hydrate with mock real-time data
  return data.map((holding: any) => {
    // We mock current_price if it's identical or just to simulate live changes
    const currentPrice = getMockCurrentPrice(holding.ticker, holding.average_buy_price);
    const marketValue = holding.quantity * currentPrice;
    const investedAmount = holding.quantity * holding.average_buy_price;
    const overallReturn = marketValue - investedAmount;
    const overallReturnPercent = (overallReturn / investedAmount) * 100;
    
    const todayChangePercent = (Math.random() * 4 - 2); // -2% to +2%
    const todayChange = marketValue * (todayChangePercent / 100);

    return {
      ...holding,
      current_price: currentPrice,
      market_value: marketValue,
      today_change: todayChange,
      today_change_percent: todayChangePercent,
      overall_return: overallReturn,
      overall_return_percent: overallReturnPercent,
      ai_rating: Math.random() > 0.5 ? 'Buy' : 'Hold',
      risk_level: Math.random() > 0.6 ? 'Medium' : 'Low',
    } as PortfolioHolding;
  });
}

export async function addHolding(holdingData: Partial<PortfolioHolding>): Promise<PortfolioHolding | null> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error('Not authenticated');
  }

  const marketValue = (holdingData.quantity || 0) * (holdingData.current_price || 0);

  const { data, error } = await supabase
    .from('portfolio_holdings')
    .insert([{
      ...holdingData,
      user_id: userData.user.id,
      market_value: marketValue
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding holding:', error);
    return null;
  }

  revalidatePath('/portfolio');
  return data;
}

export async function deleteHolding(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('portfolio_holdings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting holding:', error);
    return false;
  }

  revalidatePath('/portfolio');
  return true;
}

// -- STATS & INSIGHTS --

export async function getPortfolioStats(): Promise<PortfolioStats> {
  const holdings = await getPortfolioHoldings();
  
  const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + (h.quantity * h.average_buy_price), 0);
  const todayChange = holdings.reduce((sum, h) => sum + (h.today_change || 0), 0);
  
  const overallReturn = totalValue - totalInvested;
  const overallReturnPercent = totalInvested > 0 ? (overallReturn / totalInvested) * 100 : 0;
  const todayChangePercent = totalValue > 0 ? (todayChange / totalValue) * 100 : 0;

  const sortedHoldings = [...holdings].sort((a, b) => (b.overall_return_percent || 0) - (a.overall_return_percent || 0));

  return {
    totalValue,
    todayChange,
    todayChangePercent,
    overallReturn,
    overallReturnPercent,
    realizedGain: overallReturn * 0.2, // mock
    unrealizedGain: overallReturn * 0.8, // mock
    dividendIncome: 1250.50, // mock
    cashBalance: 15000.00, // mock
    totalHoldings: holdings.length,
    averageReturn: overallReturnPercent,
    bestPerformer: sortedHoldings[0] || null,
    worstPerformer: sortedHoldings[sortedHoldings.length - 1] || null,
    portfolioHealthScore: 85,
    aiConfidenceScore: 92
  };
}

export async function generatePortfolioSummary(): Promise<AIInsights> {
  // In a real app, this would call Gemini or another LLM based on the user's holdings.
  // Returning mock AI Insights for UI completeness.
  return {
    portfolioHealth: "Excellent",
    todaySummary: "Your portfolio is up today, outperforming the S&P 500 largely due to strong performance in the Technology sector.",
    strengths: [
      "Strong exposure to high-growth tech",
      "Good dividend yield on stable assets",
      "Low overall volatility compared to benchmark"
    ],
    weaknesses: [
      "Over-concentrated in US equities",
      "Low exposure to emerging markets",
      "Cash drag from uninvested balance"
    ],
    riskAssessment: "Moderate risk. Volatility is acceptable but sector concentration could lead to deeper drawdowns if tech corrects.",
    diversificationAnalysis: "Your portfolio is 60% Tech, 20% Finance, 10% Healthcare. Consider diversifying into Industrials or Consumer Defensive.",
    sectorConcentration: "High concentration in Technology (60%).",
    potentialOpportunities: [
      "Undervalued defensive stocks",
      "Emerging market ETFs",
      "High-yield corporate bonds"
    ],
    potentialRisks: [
      "Tech sector correction",
      "Interest rate hikes impacting growth stocks"
    ],
    suggestedRebalancing: [
      "Trim NVDA by 5%",
      "Add to VTI",
      "Consider buying JNJ for defensive positioning"
    ],
    overvaluedHoldings: ["NVDA", "TSLA"],
    undervaluedHoldings: ["JPM", "PFE"],
    longTermOutlook: "Positive. The portfolio is well-positioned for growth over the next 5-10 years, assuming minor rebalancing to manage tech exposure.",
    confidenceScore: 88
  };
}
