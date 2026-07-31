// Shared types for the News feature
export interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  image: string;
  source: string;
  url: string;
  datetime: number; // Unix timestamp
  category: string;
  related?: string;
}

export type NewsCategory = "general" | "forex" | "crypto" | "merger";

export interface CategoryTab {
  id: NewsCategory;
  label: string;
  emoji: string;
  description: string;
}

export const NEWS_CATEGORIES: CategoryTab[] = [
  {
    id: "general",
    label: "Top Stories",
    emoji: "📰",
    description: "Global financial headlines",
  },
  {
    id: "forex",
    label: "Forex",
    emoji: "💱",
    description: "Currency market news",
  },
  {
    id: "crypto",
    label: "Crypto",
    emoji: "₿",
    description: "Cryptocurrency updates",
  },
  {
    id: "merger",
    label: "M&A",
    emoji: "🤝",
    description: "Mergers & acquisitions",
  },
];

/** Format a Unix timestamp to a human-readable relative time */
export function formatRelativeTime(unix: number): string {
  const now = Date.now();
  const diff = now - unix * 1000;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Format a date for the featured card */
export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
