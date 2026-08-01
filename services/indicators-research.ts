import {
  MarketIndicator,
  IndicatorSnapshot,
  IndicatorResearchBundle
} from "@/types/market-indicators";

import {
  MARKET_INDICATORS,
  getIndicatorMeta,
  generateIndicatorSnapshot,
  generateIndicatorData
} from "@/lib/indicators-fallback-data";

export async function getPopularIndicators(): Promise<IndicatorSnapshot[]> {
  // Return snapshots for ALL indicators so the grid can display them by category
  const snapshots: IndicatorSnapshot[] = [];
  
  for (const meta of MARKET_INDICATORS) {
    const snap = generateIndicatorSnapshot(meta.id);
    if (snap) snapshots.push(snap);
  }
  
  return snapshots;
}

export async function getPopularIndicatorsOnly(): Promise<IndicatorSnapshot[]> {
  const popularMeta = MARKET_INDICATORS.filter(ind => ind.popular);
  const snapshots: IndicatorSnapshot[] = [];
  
  for (const meta of popularMeta) {
    const snap = generateIndicatorSnapshot(meta.id);
    if (snap) snapshots.push(snap);
  }
  
  return snapshots;
}

export async function getIndicatorResearchBundle(id: string): Promise<IndicatorResearchBundle | null> {
  const meta = getIndicatorMeta(id);
  if (!meta) return null;
  
  const snapshot = generateIndicatorSnapshot(id);
  const historicalData = generateIndicatorData(id, 365); // 1 year of data
  
  if (!snapshot) return null;
  
  // Find related indicators in the same category
  const relatedIndicators = MARKET_INDICATORS
    .filter(ind => ind.category === meta.category && ind.id !== meta.id)
    .slice(0, 3)
    .map(ind => ind.id);

  return {
    indicator: meta,
    snapshot,
    historicalData,
    relatedIndicators
  };
}

export async function searchIndicators(query: string): Promise<MarketIndicator[]> {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return MARKET_INDICATORS.filter(ind => 
    ind.name.toLowerCase().includes(lowerQuery) || 
    ind.shortName.toLowerCase().includes(lowerQuery) ||
    ind.id.toLowerCase().includes(lowerQuery)
  );
}

export async function getAllIndicators(): Promise<MarketIndicator[]> {
  return MARKET_INDICATORS;
}
