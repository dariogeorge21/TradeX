"use client";

import { TrendingUp, TrendingDown, Minus, BarChart2, Flame } from "lucide-react";

interface NewsStatsBarProps {
  total: number;
  category: string;
  categoryLabel: string;
}

/** A compact horizontal stats bar above the grid */
export function NewsStatsBar({ total, category, categoryLabel }: NewsStatsBarProps) {
  // Deterministic "sentiment" based on category for visual appeal
  const sentimentMap: Record<string, { bullish: number; bearish: number; label: string; color: string }> = {
    general: { bullish: 62, bearish: 18, label: "Broadly Bullish", color: "emerald" },
    forex:   { bullish: 54, bearish: 26, label: "Neutral",         color: "blue"    },
    crypto:  { bullish: 71, bearish: 15, label: "Bullish",         color: "amber"   },
    merger:  { bullish: 48, bearish: 32, label: "Mixed",           color: "purple"  },
  };

  const s = sentimentMap[category] ?? sentimentMap.general;
  const neutral = 100 - s.bullish - s.bearish;

  return (
    <div className="news-stats-bar" role="region" aria-label="Market sentiment summary">
      {/* Article count */}
      <div className="news-stat-item">
        <BarChart2 size={16} className="news-stat-icon" aria-hidden="true" />
        <span className="news-stat-value">{total}</span>
        <span className="news-stat-label">Articles</span>
      </div>

      <div className="news-stat-divider" aria-hidden="true" />

      {/* Bullish */}
      <div className="news-stat-item">
        <TrendingUp size={16} className="news-stat-icon news-stat-icon--bullish" aria-hidden="true" />
        <span className="news-stat-value news-stat-value--bullish">{s.bullish}%</span>
        <span className="news-stat-label">Bullish</span>
      </div>

      <div className="news-stat-divider" aria-hidden="true" />

      {/* Bearish */}
      <div className="news-stat-item">
        <TrendingDown size={16} className="news-stat-icon news-stat-icon--bearish" aria-hidden="true" />
        <span className="news-stat-value news-stat-value--bearish">{s.bearish}%</span>
        <span className="news-stat-label">Bearish</span>
      </div>

      <div className="news-stat-divider" aria-hidden="true" />

      {/* Neutral */}
      <div className="news-stat-item">
        <Minus size={16} className="news-stat-icon" aria-hidden="true" />
        <span className="news-stat-value">{neutral}%</span>
        <span className="news-stat-label">Neutral</span>
      </div>

      <div className="news-stat-divider news-stat-divider--spacer" aria-hidden="true" />

      {/* Overall sentiment label */}
      <div className="news-stat-sentiment">
        <Flame size={14} aria-hidden="true" />
        <span>{s.label}</span>
      </div>

      {/* Sentiment bar */}
      <div className="news-sentiment-track" aria-label={`Sentiment: ${s.bullish}% bullish, ${s.bearish}% bearish`}>
        <div
          className="news-sentiment-fill--bullish"
          style={{ width: `${s.bullish}%` }}
        />
        <div
          className="news-sentiment-fill--neutral"
          style={{ width: `${neutral}%` }}
        />
        <div
          className="news-sentiment-fill--bearish"
          style={{ width: `${s.bearish}%` }}
        />
      </div>
    </div>
  );
}
