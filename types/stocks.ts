export type StockSymbol = string;

export type StockSearchResult = {
  symbol: StockSymbol;
  displaySymbol: string;
  description: string;
  type?: string;
};

export type ApiErrorPayload = {
  error: string;
};

