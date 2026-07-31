---

# 1. Market News API (Global Financial News)

**Endpoint**

```http
GET /api/v1/news
```

### Purpose

Returns the latest market-wide financial news.

Use this for:

* Homepage news feed
* Trending market events
* Crypto news
* Forex news
* Mergers & acquisitions
* Global financial headlines

This endpoint returns the latest market news by category. 

---

## Request

```http
GET https://finnhub.io/api/v1/news
```

### Query Parameters

| Parameter | Required | Description                                  |
| --------- | -------- | -------------------------------------------- |
| category  | ✅        | general, forex, crypto, merger               |
| minId     | ❌        | Return only articles newer than this news ID |

Example

```http
GET /news?category=general&token=YOUR_API_KEY
```

or

```http
GET /news?category=crypto
```

---

## Response

```json
[
  {
    "category": "technology",
    "datetime": 1722339600,
    "headline": "Apple announces new AI features",
    "id": 5123412,
    "image": "https://...",
    "related": "",
    "source": "CNBC",
    "summary": "Apple introduced...",
    "url": "https://..."
  }
]
```

---

## Fields

| Field    | Description      |
| -------- | ---------------- |
| id       | Unique news ID   |
| headline | News title       |
| summary  | Short summary    |
| image    | Thumbnail        |
| source   | Publisher        |
| url      | Original article |
| datetime | Unix timestamp   |
| category | News category    |

---

## Frontend Usage

Create pages like

```
Latest News

Top Stories

Crypto News

Forex News

Merger News
```

Card example

```
Image

Headline

Source

Published Time

Summary

Read More →
```

---

## Backend Usage

Cache results for:

```
5–15 minutes
```

Avoid requesting every page refresh.

---

# 2. Company News API

**Endpoint**

```http
GET /api/v1/company-news
```

This endpoint lists company-specific news for a given symbol (available for North American companies). 

---

## Purpose

Returns news about a specific company.

Perfect for

```
AAPL

MSFT

GOOG

TSLA

NVDA
```

---

## Request

```http
GET /company-news
```

Parameters

| Parameter | Required |
| --------- | -------- |
| symbol    | ✅        |
| from      | ✅        |
| to        | ✅        |

Example

```http
GET /company-news?symbol=AAPL&from=2026-07-01&to=2026-07-31
```

---

## Response

```json
[
  {
    "headline": "...",
    "summary": "...",
    "image": "...",
    "url": "...",
    "source": "Reuters",
    "datetime": 1722430000
  }
]
```

---

## Frontend Usage

On Stock Details page

```
Apple

Price

Chart

News

Financials

Recommendations
```

News section

```
Apple unveils...

Apple acquires...

Apple earnings...
```

---

## Backend Usage

When user opens

```
/stocks/AAPL
```

Backend fetches

```
Quote

Company Profile

Company News

Financials

Recommendations
```

Returns a single combined response.

---

# 3. News Sentiment API

**Endpoint**

```http
GET /api/v1/news-sentiment
```

Returns aggregated sentiment and news statistics for a company (US companies only). 

---

## Purpose

This endpoint is extremely useful for AI.

Instead of manually reading 100 articles...

Finnhub already calculates

* Bullish %
* Bearish %
* News Score
* Buzz Score

---

## Request

```http
GET /news-sentiment?symbol=AAPL
```

---

## Response

```json
{
  "buzz": {
    "articlesInLastWeek": 20,
    "buzz": 0.89,
    "weeklyAverage": 22.5
  },
  "companyNewsScore": 0.91,
  "sectorAverageBullishPercent": 0.64,
  "sectorAverageNewsScore": 0.52,
  "sentiment": {
    "bearishPercent": 0,
    "bullishPercent": 1
  }
}
```

---

## Frontend

Show widgets

```
News Sentiment

Bullish

92%

Buzz

High

News Score

91%
```

---

## AI Usage

Feed these values directly into your prompt.

Example

```
Current Price

RSI

MACD

News Score

Bullish %

Latest Headlines

Recommend BUY, HOLD or SELL.
```

Much cheaper than sending dozens of full articles to an LLM.

---

# 4. Press Releases API

**Endpoint**

```http
GET /api/v1/press-releases
```

Returns major company press releases and significant corporate announcements. 

---

## Purpose

Official announcements.

Examples

```
Dividend

Acquisition

CEO Change

New Product

Quarterly Results

FDA Approval
```

These are primary-source communications from companies, rather than media reporting.

---

## Request

```http
GET /press-releases
```

Parameters

```
symbol

from

to
```

Example

```http
GET /press-releases?symbol=AAPL&from=2026-07-01&to=2026-07-31
```

---

## Response

```json
{
  "majorDevelopment": [
    {
      "symbol": "AAPL",
      "headline": "Apple announces...",
      "description": "...",
      "datetime": "2026-07-30 14:30:00"
    }
  ]
}
```

---

## Frontend

```
Official Announcements

Dividend

Quarterly Report

Press Release
```

---

## Backend

Useful for

```
Alerts

Notifications

AI Summary

Timeline
```

---

# Recommended Backend Architecture

```
Frontend

     │

     ▼

Next.js API

     │

     ▼

Redis Cache (optional)

     │

     ▼

Finnhub REST APIs

     │

     ├── /news
     ├── /company-news
     ├── /news-sentiment
     └── /press-releases
```

Cache recommendations:

| Endpoint       | Cache Time |
| -------------- | ---------- |
| Market News    | 10–15 min  |
| Company News   | 5–10 min   |
| Sentiment      | 15–30 min  |
| Press Releases | 30–60 min  |

---

# Recommended Frontend Pages

| Page             | APIs                                |
| ---------------- | ----------------------------------- |
| Dashboard        | `/news`                             |
| Market News      | `/news`                             |
| Stock Details    | `/company-news`                     |
| AI Analysis      | `/company-news` + `/news-sentiment` |
| Company Timeline | `/press-releases`                   |
| Notifications    | `/press-releases` + `/news`         |

---

# Recommended APIs for TradeX MVP

If you're building a polished MVP within a short timeframe, these four endpoints are sufficient:

1. **`/news`** — Global market headlines.
2. **`/company-news`** — Company-specific news for a selected stock.
3. **`/news-sentiment`** — Ready-to-use sentiment metrics for AI and dashboards.
4. **`/press-releases`** — Official corporate announcements.

Combined with `/quote`, `/stock/candle`, `/indicator`, and `/stock/recommendation`, they provide a strong foundation for an AI-powered trading dashboard without needing to ingest and analyze raw news feeds yourself.
