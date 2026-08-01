export interface ForexSnapshotTicker {
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
  lastQuote: {
    a: number; // ask
    b: number; // bid
    x: number; // exchange id
    t: number; // timestamp
  };
}

export interface ForexAggregate {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  vw: number;
  n: number;
}

export interface ForexIndicatorValue {
  timestamp: number;
  value: number;
}

export interface ForexMACDValue {
  timestamp: number;
  value: number;
  signal: number;
  histogram: number;
}

export interface ForexDetailBundle {
  symbol: string;
  asOfIso: string;
  snapshot: ForexSnapshotTicker | null;
  aggregates: ForexAggregate[];
  rsi: ForexIndicatorValue[];
  macd: ForexMACDValue[];
  ema: ForexIndicatorValue[];
  providerErrors: Array<{ provider: string; message: string }>;
}
