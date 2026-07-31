"use client";

import { Newspaper, RefreshCw } from "lucide-react";
import type { NewsCategory } from "./types";
import { NEWS_CATEGORIES } from "./types";

interface NewsPageHeaderProps {
  activeCategory: NewsCategory;
}

export function NewsPageHeader({ activeCategory }: NewsPageHeaderProps) {
  const cat = NEWS_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="news-page-header">
      {/* Icon + title */}
      <div className="news-page-header-left">
        <div className="news-page-icon" aria-hidden="true">
          <Newspaper size={22} />
        </div>
        <div>
          <h1 className="news-page-title">Market News</h1>
          <p className="news-page-subtitle">
            {cat?.description ?? "Latest financial headlines"}
          </p>
        </div>
      </div>

      {/* Right meta */}
      <div className="news-page-header-right">
        <div className="news-refresh-badge">
          <RefreshCw size={12} aria-hidden="true" className="news-refresh-icon" />
          <span>Updates every 10 min</span>
        </div>
      </div>
    </div>
  );
}
