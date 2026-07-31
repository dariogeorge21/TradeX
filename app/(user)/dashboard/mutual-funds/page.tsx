import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MutualFundSearchBar } from "@/components/mutual-funds/MutualFundSearchBar";
import { PopularMutualFunds } from "@/components/mutual-funds/PopularMutualFunds";
import { Search } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion-wrapper";

export const metadata: Metadata = {
  title: "Mutual Funds — TradeX",
  description: "AI-powered mutual fund research and intelligence.",
};

export default function MutualFundsIndexPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-6xl space-y-8 pb-8"
    >
      {/* Hero Search Section */}
      <Card className="relative overflow-hidden border-2 border-emerald-500/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-background to-blue-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl opacity-50"
        />

        <CardHeader className="relative text-center pt-10">
          <CardTitle className="text-3xl font-extrabold tracking-tight md:text-4xl text-emerald-950 dark:text-emerald-50">
            Discover Mutual Funds
          </CardTitle>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Search any mutual fund by symbol or name to access an institutional-grade dashboard with real-time AI synthesis.
          </p>
        </CardHeader>
        <CardContent className="relative max-w-8xl w-[500px] mx-auto pb-12">
          <div className="relative group flex justify-center">
            <div className="absolute inset-x-0 -inset-y-1 mx-auto max-w-[600px] rounded-xl bg-linear-to-r from-emerald-500 to-blue-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex items-center w-full max-w-[600px] bg-background rounded-lg shadow-sm border border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="h-5 w-5 text-emerald-500/70" />
              </div>
              <div className="flex-1 w-full">
                <MutualFundSearchBar className="[&>div>div]:border-0 [&>div>div]:shadow-none [&>div>div]:bg-transparent [&>div>div]:focus-within:ring-0 [&>div>div>input]:text-lg [&>div>div>input]:py-6" placeholder="Search mutual funds (e.g., VTSAX, FXAIX)…" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Mutual Funds Section */}
      <PopularMutualFunds />
    </MotionDiv>
  );
}
