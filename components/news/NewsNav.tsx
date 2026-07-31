"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NEWS_CATEGORIES, type NewsCategory } from "./types";

interface NewsNavProps {
  activeCategory: NewsCategory;
}

const categoryAccent: Record<NewsCategory, string> = {
  general: "news-nav-tab--emerald",
  forex: "news-nav-tab--blue",
  crypto: "news-nav-tab--amber",
  merger: "news-nav-tab--purple",
};

export function NewsNav({ activeCategory }: NewsNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildHref(category: NewsCategory) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    return `/dashboard/news?${params.toString()}`;
  }

  return (
    <nav className="news-nav" role="navigation" aria-label="News categories">
      <div className="news-nav-inner">
        {NEWS_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={buildHref(cat.id)}
              prefetch
              className={[
                "news-nav-tab",
                categoryAccent[cat.id],
                isActive ? "news-nav-tab--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="news-nav-tab-emoji" aria-hidden="true">
                {cat.emoji}
              </span>
              <span className="news-nav-tab-label">{cat.label}</span>
              {isActive && (
                <span className="news-nav-tab-indicator" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Live badge */}
      <div className="news-nav-live" aria-label="Data refreshes every 10 minutes">
        <span className="news-live-dot" aria-hidden="true" />
        <span className="news-live-text">Live</span>
      </div>
    </nav>
  );
}
