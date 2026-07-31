# Massive API Skill

## Purpose
Use the Massive REST API to retrieve market data across crypto, stocks, forex, options, and indices.

## Authentication
- API Key: <API_KEY>

## Base URL
https://api.massive.com

## Common Rules
- UTC timestamps
- Pagination via next_url
- Respect rate limits

## Crypto Endpoints

### Reference
- GET /v3/reference/tickers
- GET /v3/reference/tickers/{ticker}
- GET /v3/reference/exchanges
- GET /v3/reference/conditions

### Aggregates
- GET /v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}
- GET /v2/aggs/grouped/locale/global/market/crypto/{date}
- GET /v2/aggs/ticker/{ticker}/prev

### Snapshots
- GET /v2/snapshot/locale/global/markets/crypto/tickers
- GET /v2/snapshot/locale/global/markets/crypto/tickers/{ticker}
- GET /v2/snapshot/locale/global/markets/crypto/{direction}
- GET /v3/snapshot

### Trades
- GET /v3/trades/{ticker}
- GET /v1/last/crypto/{from}/{to}

### Indicators
- SMA
- EMA
- RSI
- MACD

...

Best Practices
- Use snapshots for current market state.
- Use aggregates for charting.
- Use trades for tick-level analysis.
- Use indicators for technical analysis.