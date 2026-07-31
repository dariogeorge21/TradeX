import "server-only";

import { streamOpenAIText } from "@/lib/openai";
import type { StockResearchBundle } from "@/types/stock-research";

export const STOCK_RESEARCH_SYSTEM_PROMPT = `You are a Senior Wall Street Equity Research Analyst with expertise in Fundamental Analysis, Technical Analysis, Company Valuation, Macroeconomics, Market Psychology, Financial Statements, and Risk Management.

Never hallucinate.
Never invent numbers.
Only use supplied financial data.
If data is missing clearly mention it.
Always explain your reasoning.
Always maintain a professional tone.
Never guarantee investment returns.
Always include risks.
Always include uncertainties.
Always provide balanced opinions.
Never recommend buying solely because of past performance.

Output format: structured markdown with headings and bullet points.`;

export function buildStockResearchUserInput(bundle: StockResearchBundle): string {
  const payload = {
    generatedAt: bundle.asOfIso,
    symbol: bundle.symbol,
    company: bundle.profile,
    fundamentals: bundle.fundamentals,
    quote: bundle.quote,
    metrics: bundle.metrics,
    recommendations: bundle.recommendations,
    technicals: bundle.technicals,
    recentNews: bundle.news.slice(0, 12).map((n) => ({
      headline: n.headline,
      source: n.source,
      datetimeUnixSeconds: n.datetimeUnixSeconds,
      url: n.url,
    })),
    priceHistoryDaily: bundle.historicalDaily.slice(-180),
    dataGaps: bundle.providerErrors,
  };

  return `Generate an institutional-grade equity research note for the company below.

You must produce the following sections:
- Executive Summary
- Business Overview
- Current Financial Health
- Revenue Outlook
- Growth Potential
- Competitive Advantages
- Risks
- Market Sentiment
- Recent News Summary
- Technical Analysis
- Fundamental Analysis
- Long-term Investment Outlook
- Short-term Outlook
- Bullish Factors
- Bearish Factors
- Things Investors Should Monitor
- Final Recommendation

Final Recommendation must include:
- Recommendation: Strong Buy | Buy | Hold | Sell | Strong Sell
- Confidence Score (0-100)
- Investment Horizon: Short | Medium | Long
- Risk Level: Low | Medium | High
- Important Disclaimer

If key data required for a section is missing, explicitly state what is missing and avoid guessing.

DATA (JSON):
${JSON.stringify(payload)}`;
}

export async function streamStockResearchMarkdown(bundle: StockResearchBundle) {
  return streamOpenAIText({
    systemPrompt: STOCK_RESEARCH_SYSTEM_PROMPT,
    userInput: buildStockResearchUserInput(bundle),
    model: "llama-3.1-70b-versatile",
  });
}

