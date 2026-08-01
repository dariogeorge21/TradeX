import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicatorsSearchBar } from "@/components/indicators/IndicatorsSearchBar";
import { PopularIndicators } from "@/components/indicators/PopularIndicators";
import { Search } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion-wrapper";
import { getPopularIndicators } from "@/services/indicators-research";

export const metadata: Metadata = {
  title: "Market Indicators — TradeX",
  description: "AI-powered market indicator research and intelligence.",
};

export default async function IndicatorsIndexPage() {
  const snapshots = await getPopularIndicators();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-6xl space-y-8 pb-8"
    >
      {/* Hero Search Section */}
      <Card className="relative overflow-hidden border-2 border-violet-500/20 bg-card/80 backdrop-blur-xl shadow-2xl shadow-violet-500/5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-500/10 via-background to-fuchsia-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl opacity-50"
        />

        <CardHeader className="relative text-center pt-10">
          <CardTitle className="text-3xl font-extrabold tracking-tight md:text-4xl text-violet-950 dark:text-violet-50">
            Market Indicators
          </CardTitle>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Search any technical or macroeconomic indicator for an institutional-grade dashboard with real-time AI synthesis.
          </p>
        </CardHeader>
        <CardContent className="relative max-w-8xl w-[500px] mx-auto pb-12">
          <div className="relative group flex justify-center">
            <div className="absolute inset-x-0 -inset-y-1 mx-auto max-w-[600px] rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex items-center w-full max-w-[600px] bg-background rounded-lg shadow-sm border border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="h-5 w-5 text-violet-500/70" />
              </div>
              <div className="flex-1 w-full">
                <IndicatorsSearchBar
                  className="[&>div>div]:border-0 [&>div>div]:shadow-none [&>div>div]:bg-transparent [&>div>div]:focus-within:ring-0 [&>div>div>input]:text-lg [&>div>div>input]:py-6"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Indicators Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Popular Indicators</h2>
        <PopularIndicators snapshots={snapshots} />
      </div>
    </MotionDiv>
  );
}
