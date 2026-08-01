export interface CryptoSnapshotTicker {
  ticker: string;
  todaysChange: number;
  todaysChangePerc: number;
  updated: number;
  day: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw: number;
  };
  min: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw: number;
  };
  prevDay: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw: number;
  };
  lastTrade: {
    p: number;
    s: number;
    t: number;
  };
}

export interface CryptoAggregate {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  vw: number;
  n: number;
}

export interface IndicatorValue {
  timestamp: number;
  value: number;
}

export interface MACDValue {
  timestamp: number;
  value: number;
  signal: number;
  histogram: number;
}

export interface CryptoDetailBundle {
  symbol: string;
  asOfIso: string;
  snapshot: CryptoSnapshotTicker | null;
  aggregates: CryptoAggregate[];
  rsi: IndicatorValue[];
  macd: MACDValue[];
  ema: IndicatorValue[];
  providerErrors: Array<{ provider: string; message: string }>;
}
