import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsNav } from "@/components/news/NewsNav";
import { NewsFeaturedCard } from "@/components/news/NewsFeaturedCard";
import { NewsGrid } from "@/components/news/NewsGrid";
import { NewsStatsBar } from "@/components/news/NewsStatsBar";
import { NewsPageHeader } from "@/components/news/NewsPageHeader";
import type { NewsArticle, NewsCategory } from "@/components/news/types";
import { NEWS_CATEGORIES } from "@/components/news/types";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Market News — TradeX",
  description:
    "Stay ahead with real-time global financial news, crypto updates, forex movements, and M&A activity powered by Finnhub.",
};

// ---------------------------------------------------------------------------
// Data fetching (server-side, cached via Next.js fetch + our route cache)
// ---------------------------------------------------------------------------
async function fetchNews(category: NewsCategory): Promise<NewsArticle[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;
    const res = await fetch(url, {
      next: { revalidate: 600 }, // ISR — revalidate every 10 min
    });
    if (!res.ok) return [];
    const data: NewsArticle[] = await res.json();
    // Filter articles that have a headline and deduplicate by id
    const seen = new Set<number>();
    return data.filter((a) => {
      if (!a.headline || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------
interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const rawCategory = params.category ?? "general";
  const validIds = NEWS_CATEGORIES.map((c) => c.id);
  const activeCategory: NewsCategory = validIds.includes(rawCategory as NewsCategory)
    ? (rawCategory as NewsCategory)
    : "general";

  const categoryData = NEWS_CATEGORIES.find((c) => c.id === activeCategory)!;

  // Fetch articles server-side
  const articles = await fetchNews(activeCategory);

  // Split: first item → featured hero, rest → grid
  const [featured, ...rest] = articles;

  return (
    <div className="news-page">
      {/* Ambient decorative blobs */}
      <div className="news-page-bg" aria-hidden="true">
        <div className="news-blob news-blob--1" />
        <div className="news-blob news-blob--2" />
        <div className="news-blob news-blob--3" />
        <div className="news-bg-grid" />
      </div>

      {/* Page shell */}
      <div className="news-page-shell">
        {/* Header */}
        <NewsPageHeader activeCategory={activeCategory} />

        {/* Category nav tabs — client component for URL navigation */}
        <Suspense>
          <NewsNav activeCategory={activeCategory} />
        </Suspense>

        {/* Stats bar */}
        {articles.length > 0 && (
          <NewsStatsBar
            total={articles.length}
            category={activeCategory}
            categoryLabel={categoryData.label}
          />
        )}

        {/* Featured hero article */}
        {featured && (
          <section aria-label="Featured story">
            <NewsFeaturedCard article={featured} />
          </section>
        )}

        {/* Section label */}
        {rest.length > 0 && (
          <div className="news-section-label">
            <span className="news-section-label-line" aria-hidden="true" />
            <span className="news-section-label-text">
              {categoryData.emoji} {categoryData.label} — {rest.length} more stories
            </span>
            <span className="news-section-label-line" aria-hidden="true" />
          </div>
        )}

        {/* Article grid */}
        <NewsGrid articles={rest} />

        {/* Footer note */}
        <div className="news-page-footer-note" aria-label="Data attribution">
          <p>
            News data provided by{" "}
            <a
              href="https://finnhub.io"
              target="_blank"
              rel="noopener noreferrer"
              className="news-footer-link"
            >
              Finnhub
            </a>
            . All content belongs to respective publishers.
          </p>
        </div>
      </div>
    </div>
  );
}
