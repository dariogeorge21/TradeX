import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeX — AI Market Insight | Understand Stocks in Seconds",
  description:
    "TradeX is an AI-powered market research assistant that simplifies stock analysis, evaluates investment risks, and answers market-related questions — no complex charts needed.",
  keywords: ["stock analysis", "AI investing", "market insights", "risk assessment", "TradeX"],
  appleWebApp: {
    title: "TradeX",
  },
  openGraph: {
    title: "TradeX — AI Market Insight",
    description: "Understand the stock market in seconds with AI-powered plain-language insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        figtree.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
