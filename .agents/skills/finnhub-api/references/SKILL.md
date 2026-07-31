# Finnhub API Skill

This skill enables you to interact with the Finnhub API, a comprehensive RESTful financial data platform. You can retrieve real-time and historical data for stocks, forex, cryptocurrencies, and economic indicators. All examples use the free tier of the API, which has specific rate limits.

## Authentication

All requests require an API key. You must pass your key as a query parameter `token` or in the header `X-Finnhub-Token`.

**Important:** You can obtain a free API key from your Finnhub Dashboard.

## Rate Limits

- The free tier has a limit on the number of calls per minute.
- A global limit of 30 API calls per second is applied to all plans.
- A `429` status code is returned when the limit is exceeded.

## Common Endpoints and Patterns

- **Base URL:** `https://finnhub.io/api/v1`
- **Response Format:** All responses are in JSON.

## 1. Fundamentals

These endpoints provide information about a company's profile, financials, and ownership.

### 1.1 Company Profile 2 (Free)

Get general information about a company. This is the free version of the full profile endpoint.

- **Endpoint:** `/stock/profile2`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol of the company. Eg: `AAPL`
  - `isin` (optional, string): The ISIN of the company.
  - `cusip` (optional, string): The CUSIP of the company.
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "country": "US",
  "currency": "USD",
  "exchange": "NASDAQ/NMS (GLOBAL MARKET)",
  "ipo": "1980-12-12",
  "marketCapitalization": 1415993,
  "name": "Apple Inc",
  "phone": "14089961010",
  "shareOutstanding": 4375.47998046875,
  "ticker": "AAPL",
  "weburl": "https://www.apple.com/",
  "logo": "https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png",
  "finnhubIndustry": "Technology"
}
```

### 1.2 Stock Symbol List (Free)

List all supported stocks for a given exchange.

- **Endpoint:** `/stock/symbol`
- **Method:** GET
- **Parameters:**
  - `exchange` (required, string): The exchange code. (e.g., `US` for US exchanges).
  - `mic` (optional, string): Filter by MIC code.
  - `securityType` (optional, string): Filter by security type (e.g., `Common Stock`).
  - `currency` (optional, string): Filter by currency.
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=YOUR_API_KEY`
- **Response Sample:**
```json
[
  {
    "currency": "USD",
    "description": "APPLE INC",
    "displaySymbol": "AAPL",
    "figi": "BBG000B9Y5X2",
    "mic": "XNGS",
    "symbol": "AAPL",
    "type": "Common Stock"
  }
]
```

### 1.3 Basic Financials (Free)

Get a company's key financial ratios like P/E, EPS, and market cap.

- **Endpoint:** `/stock/metric`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `metric` (required, string): Currently, only `all` is supported.
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=all&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "symbol": "AAPL",
  "metricType": "all",
  "metric": {
    "10DayAverageTradingVolume": 32.50147,
    "52WeekHigh": 310.43,
    "52WeekLow": 149.22,
    "52WeekLowDate": "2019-01-14",
    "52WeekPriceReturnDaily": 101.96334,
    "beta": 1.2989
  }
}
```

### 1.4 Peers (Free)

Get a list of peers for a given company.

- **Endpoint:** `/stock/peers`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `grouping` (optional, string): `sector`, `industry`, or `subIndustry`. Defaults to `subIndustry`.
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=YOUR_API_KEY`
- **Response Sample:**
```json
["AAPL", "EMC", "HPQ", "DELL", "WDC", "HPE", "NTAP", "CPQ", "SNDK", "SEG"]
```

### 1.5 Insider Transactions (Free)

Get a list of insider transactions for a company.

- **Endpoint:** `/stock/insider-transactions`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `from` (optional, string): Start date (YYYY-MM-DD).
  - `to` (optional, string): End date (YYYY-MM-DD).
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/insider-transactions?symbol=TSLA&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "symbol": "TSLA",
  "data": [
    {
      "name": "Kirkhorn Zachary",
      "share": 57234,
      "change": -1250,
      "filingDate": "2021-03-19",
      "transactionDate": "2021-03-17",
      "transactionCode": "S",
      "transactionPrice": 655.81
    }
  ]
}
```

### 1.6 Insider Sentiment (Free)

Get aggregated insider sentiment data for a company (MSPR - Monthly Share Purchase Ratio).

- **Endpoint:** `/stock/insider-sentiment`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `from` (required, string): Start date (YYYY-MM-DD).
  - `to` (required, string): End date (YYYY-MM-DD).
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=TSLA&from=2021-01-01&to=2022-01-01&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "symbol": "TSLA",
  "data": [
    {
      "symbol": "TSLA",
      "year": 2021,
      "month": 3,
      "change": 5540,
      "mspr": 12.209097
    }
  ]
}
```

### 1.7 SEC Filings (Free)

Get a list of SEC filings for a company.

- **Endpoint:** `/stock/filings`
- **Method:** GET
- **Parameters:**
  - `symbol` (optional, string): The ticker symbol.
  - `from` (optional, string): Start date (YYYY-MM-DD).
  - `to` (optional, string): End date (YYYY-MM-DD).
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/filings?symbol=AAPL&token=YOUR_API_KEY`
- **Response Sample:**
```json
[
  {
    "accessNumber": "0001193125-20-050884",
    "symbol": "AAPL",
    "cik": "320193",
    "form": "8-K",
    "filedDate": "2020-02-27 00:00:00",
    "acceptedDate": "2020-02-27 06:14:21",
    "reportUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/320193/000119312520050884/d865740d8k.htm",
    "filingUrl": "https://www.sec.gov/Archives/edgar/data/320193/000119312520050884/0001193125-20-050884-index.html"
  }
]
```

### 1.8 IPO Calendar (Free)

Get recent and upcoming initial public offerings.

- **Endpoint:** `/calendar/ipo`
- **Method:** GET
- **Parameters:**
  - `from` (required, string): Start date (YYYY-MM-DD).
  - `to` (required, string): End date (YYYY-MM-DD).
- **Example Request:**
  - `https://finnhub.io/api/v1/calendar/ipo?from=2020-01-01&to=2020-04-30&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "ipoCalendar": [
    {
      "date": "2020-04-03",
      "exchange": "NASDAQ Global",
      "name": "ZENTALIS PHARMACEUTICALS, LLC",
      "numberOfShares": 7650000,
      "price": "16.00-18.00",
      "status": "expected",
      "symbol": "ZNTL",
      "totalSharesValue": 158355000
    }
  ]
}
```

### 1.9 Symbol Lookup (Free)

Search for best-matching symbols based on query text.

- **Endpoint:** `/search`
- **Method:** GET
- **Parameters:**
  - `q` (required, string): The query text.
  - `exchange` (optional, string): Limit search to a specific exchange.
- **Example Request:**
  - `https://finnhub.io/api/v1/search?q=apple&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "count": 4,
  "result": [
    {
      "description": "APPLE INC",
      "displaySymbol": "AAPL",
      "symbol": "AAPL",
      "type": "Common Stock"
    }
  ]
}
```

### 1.10 Market Status (Free)

Get the current market status for an exchange.

- **Endpoint:** `/stock/market-status`
- **Method:** GET
- **Parameters:**
  - `exchange` (required, string): The exchange code.
- **Example Request:**
  - `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "exchange": "US",
  "holiday": null,
  "isOpen": false,
  "session": "pre-market",
  "timezone": "America/New_York",
  "t": 1697018041
}
```

## 2. Market Data

Retrieve real-time and historical pricing data.

### 2.1 Quote (Free)

Get real-time quote data for a stock.

- **Endpoint:** `/quote`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
- **Example Request:**
  - `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY`
- **Response Sample:**
```json
{
  "c": 261.74,
  "h": 263.31,
  "l": 260.68,
  "o": 261.07,
  "pc": 259.45,
  "t": 1582641000
}
```
- **Field Definitions:**
  - `c`: Current price
  - `h`: High price of the day
  - `l`: Low price of the day
  - `o`: Open price of the day
  - `pc`: Previous close price
  - `t`: Timestamp

## 3. News & Sentiment

Retrieve market and company-specific news.

### 3.1 Market News (Free)

Get the latest market news.

- **Endpoint:** `/news`
- **Method:** GET
- **Parameters:**
  - `category` (required, string): `general`, `forex`, `crypto`, `merger`.
  - `minId` (optional, integer): Get news after this ID.
- **Example Request:**
  - `https://finnhub.io/api/v1/news?category=general&token=YOUR_API_KEY`
- **Response Sample:**
```json
[
  {
    "category": "technology",
    "datetime": 1596589501,
    "headline": "Square surges after reporting 64% jump in revenue",
    "id": 5085164,
    "image": "https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg",
    "related": "",
    "source": "CNBC",
    "summary": "Shares of Square soared...",
    "url": "https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html"
  }
]
```

### 3.2 Company News (Free)

Get news for a specific company.

- **Endpoint:** `/company-news`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `from` (required, string): Start date (YYYY-MM-DD).
  - `to` (required, string): End date (YYYY-MM-DD).
- **Example Request:**
  - `https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2025-05-15&to=2025-06-20&token=YOUR_API_KEY`
- **Response Sample:**
```json
[
  {
    "category": "company news",
    "datetime": 1569550360,
    "headline": "More sops needed to boost electronic manufacturing...",
    "id": 25286,
    "image": "https://img.etimg.com/thumb/msid-71321314,width-1070...",
    "related": "AAPL",
    "source": "The Economic Times India",
    "summary": "NEW DELHI | CHENNAI: India may have to offer...",
    "url": "https://economictimes.indiatimes.com/.../71321308.cms"
  }
]
```

## 4. Forex & Crypto

Access data for foreign exchange and cryptocurrencies.

### 4.1 Forex Exchanges & Symbols

- **Endpoint:** `/forex/exchange`
- **Method:** GET
- **Description:** List supported forex exchanges.
- **Example Request:**
  - `https://finnhub.io/api/v1/forex/exchange?token=YOUR_API_KEY`
- **Response Sample:**
```json
["oanda", "fxcm", "forex.com", "ic markets", "fxpro"]
```

- **Endpoint:** `/forex/symbol`
- **Method:** GET
- **Parameters:**
  - `exchange` (required, string): The exchange name.
- **Description:** List supported forex pairs for an exchange.
- **Example Request:**
  - `https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=YOUR_API_KEY`

### 4.2 Crypto Exchanges & Symbols

- **Endpoint:** `/crypto/exchange`
- **Method:** GET
- **Description:** List supported crypto exchanges.
- **Example Request:**
  - `https://finnhub.io/api/v1/crypto/exchange?token=YOUR_API_KEY`
- **Response Sample:**
```json
["KRAKEN", "HITBTC", "COINBASE", "GEMINI", "POLONIEX", "Binance"]
```

- **Endpoint:** `/crypto/symbol`
- **Method:** GET
- **Parameters:**
  - `exchange` (required, string): The exchange name.
- **Description:** List supported crypto pairs for an exchange.
- **Example Request:**
  - `https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=YOUR_API_KEY`

## 5. Technical Analysis

### 5.1 Technical Indicators (Free)

Retrieve technical indicator data.

- **Endpoint:** `/indicator`
- **Method:** GET
- **Parameters:**
  - `symbol` (required, string): The ticker symbol.
  - `resolution` (required, string): Timeframe (e.g., `D` for daily, `1` for 1 minute).
  - `from` (required, integer): Unix timestamp (start).
  - `to` (required, integer): Unix timestamp (end).
  - `indicator` (required, string): The indicator name (e.g., `sma`).
  - `timeperiod` (optional, integer): The time period for the indicator.
- **Example Request:**
  - `https://finnhub.io/api/v1/indicator?symbol=AAPL&resolution=D&from=1583098857&to=1584308457&indicator=sma&timeperiod=3&token=YOUR_API_KEY`

## 6. Useful Libraries

Finnhub provides official libraries to make integration easier. You can use these to abstract away the API calls.

- **Python:** [finnhub-python](https://github.com/Finnhub-Stock-API/finnhub-python)
- **JavaScript:** [Finnhub NPM](https://www.npmjs.com/package/finnhub)
- **Go:** [finnhub-go](https://github.com/Finnhub-Stock-API/finnhub-go)
- **Ruby:** [Finnhub Ruby](https://github.com/Finnhub-Stock-API/finnhub-ruby)
- **Kotlin:** [Finnhub Kotlin](https://github.com/Finnhub-Stock-API/finnhub-kotlin)
- **PHP:** [Finnhub PHP](https://packagist.org/packages/finnhub/client)

## 7. Websocket for Real-Time Data

For real-time data streaming, Finnhub offers WebSocket connections.

### 7.1 Trades

- **Endpoint:** `wss://ws.finnhub.io?token=<token>`
- **Description:** Stream real-time trades for stocks, forex, and crypto.

**Subscribing to a symbol:**
```json
{"type":"subscribe", "symbol": "AAPL"}
```

**Unsubscribing from a symbol:**
```json
{"type":"unsubscribe", "symbol": "AAPL"}
```

### 7.2 News

- **Endpoint:** `wss://ws.finnhub.io?token=<token>`
- **Description:** Stream real-time news for US and Canadian stocks.

**Subscribing to a symbol:**
```json
{"type":"subscribe-news", "symbol": "AAPL"}
```

### 7.3 Press Releases

- **Endpoint:** `wss://ws.finnhub.io?token=<token>`
- **Description:** Stream real-time press releases. (Enterprise Only)

**Subscribing to a symbol:**
```json
{"type":"subscribe-pr", "symbol": "AAPL"}
```