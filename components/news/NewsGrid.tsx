"use client";

import { NewsCard } from "./NewsCard";
import { type NewsArticle } from "./types";

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="news-empty" role="status" aria-live="polite">
        <div className="news-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" width={48} height={48}>
            <rect width="48" height="48" rx="12" fill="oklch(0.14 0.006 240)" />
            <path
              d="M14 16h20M14 22h16M14 28h12"
              stroke="oklch(0.40 0.008 240)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="36" cy="34" r="6" fill="oklch(0.16 0.006 240)" stroke="oklch(0.30 0.006 240)" strokeWidth="1.5" />
            <path d="M33 34h6M36 31v6" stroke="oklch(0.40 0.008 240)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="news-empty-title">No articles found</p>
        <p className="news-empty-sub">Try switching categories or check back soon.</p>
      </div>
    );
  }

  return (
    <section className="news-grid-section" aria-label="News articles">
      <div className="news-grid">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}
