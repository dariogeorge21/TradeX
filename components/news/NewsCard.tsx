"use client";

import Image from "next/image";
import { ExternalLink, Clock } from "lucide-react";
import { type NewsArticle, formatRelativeTime } from "./types";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

// Assign subtle accent colors by position
const CARD_ACCENTS = [
  "news-card--emerald",
  "news-card--blue",
  "news-card--amber",
  "news-card--purple",
  "news-card--rose",
  "news-card--teal",
];

export function NewsCard({ article, index }: NewsCardProps) {
  const accentClass = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <article
      className={`news-card ${accentClass}`}
      style={{ animationDelay: `${(index % 12) * 0.04}s` }}
    >
      {/* Thumbnail */}
      <div className="news-card-img-wrap" aria-hidden="true">
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            className="news-card-img"
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized
          />
        ) : (
          <div className="news-card-img-placeholder">
            <svg viewBox="0 0 56 42" fill="none" width={56} height={42} aria-hidden="true">
              <rect width="56" height="42" fill="oklch(0.14 0.006 240)" />
              <path
                d="M4 34L14 20L21 28L31 15L52 34H4Z"
                fill="oklch(0.70 0.18 162)"
                fillOpacity="0.25"
              />
            </svg>
          </div>
        )}
        <div className="news-card-img-overlay" />
      </div>

      {/* Body */}
      <div className="news-card-body">
        {/* Source & time */}
        <div className="news-card-meta">
          <span className="news-card-source">{article.source}</span>
          <time
            className="news-card-time"
            dateTime={new Date(article.datetime * 1000).toISOString()}
          >
            <Clock size={11} aria-hidden="true" />
            {formatRelativeTime(article.datetime)}
          </time>
        </div>

        {/* Headline */}
        <h3 className="news-card-headline">{article.headline}</h3>

        {/* Summary */}
        {article.summary && (
          <p className="news-card-summary">
            {article.summary.slice(0, 110)}
            {article.summary.length > 110 ? "…" : ""}
          </p>
        )}

        {/* Read more */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-card-link"
          aria-label={`Read more: ${article.headline}`}
        >
          <span>Read more</span>
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
