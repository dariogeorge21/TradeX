"use client";

import Image from "next/image";
import { ExternalLink, Clock, Zap } from "lucide-react";
import { type NewsArticle, formatDate, formatRelativeTime } from "./types";

interface NewsFeaturedCardProps {
  article: NewsArticle;
}

export function NewsFeaturedCard({ article }: NewsFeaturedCardProps) {
  return (
    <article className="news-featured-card" aria-label="Featured story">
      {/* Background image with overlay */}
      <div className="news-featured-img-wrap" aria-hidden="true">
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            className="news-featured-img"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            unoptimized
          />
        ) : (
          <div className="news-featured-img-placeholder" aria-hidden="true">
            <svg viewBox="0 0 80 60" fill="none" width={80} height={60}>
              <rect width="80" height="60" rx="8" fill="oklch(0.14 0.006 240)" />
              <path
                d="M10 45L26 25L36 37L50 20L70 45H10Z"
                fill="oklch(0.70 0.18 162)"
                fillOpacity="0.3"
              />
              <circle cx="60" cy="20" r="6" fill="oklch(0.65 0.18 260)" fillOpacity="0.4" />
            </svg>
          </div>
        )}
        <div className="news-featured-overlay" />
      </div>

      {/* Content */}
      <div className="news-featured-content">
        <div className="news-featured-meta">
          <span className="news-featured-badge">
            <Zap size={11} aria-hidden="true" />
            Featured
          </span>
          <span className="news-featured-source">{article.source}</span>
          <span className="news-featured-sep" aria-hidden="true">·</span>
          <time
            className="news-featured-time"
            dateTime={new Date(article.datetime * 1000).toISOString()}
          >
            <Clock size={12} aria-hidden="true" />
            {formatRelativeTime(article.datetime)}
          </time>
        </div>

        <h2 className="news-featured-headline">{article.headline}</h2>

        {article.summary && (
          <p className="news-featured-summary">
            {article.summary.slice(0, 180)}
            {article.summary.length > 180 ? "…" : ""}
          </p>
        )}

        <div className="news-featured-footer">
          <time className="news-featured-date" dateTime={new Date(article.datetime * 1000).toISOString()}>
            {formatDate(article.datetime)}
          </time>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-featured-cta"
            aria-label={`Read full story: ${article.headline}`}
          >
            Read Full Story
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
