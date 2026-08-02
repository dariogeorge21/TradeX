import { Suspense } from 'react';
import { getPortfolioHoldings, getPortfolioStats, generatePortfolioSummary } from '@/app/actions/portfolio';
import { PortfolioSkeleton } from '@/components/portfolio/PortfolioSkeleton';
import { PortfolioToolbar } from '@/components/portfolio/PortfolioToolbar';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioStats } from '@/components/portfolio/PortfolioStats';
import { PortfolioFilters } from '@/components/portfolio/PortfolioFilters';
import { HoldingsTable } from '@/components/portfolio/HoldingsTable';
import { PortfolioChart } from '@/components/portfolio/PortfolioChart';
import { AllocationChart } from '@/components/portfolio/AllocationChart';
import { PerformanceChart } from '@/components/portfolio/PerformanceChart';
import { AIInsights } from '@/components/portfolio/AIInsights';
import { TransactionsTimeline } from '@/components/portfolio/TransactionsTimeline';
import { GoalsCard } from '@/components/portfolio/GoalsCard';
import { DividendCard } from '@/components/portfolio/DividendCard';
import { EmptyState } from '@/components/portfolio/EmptyState';

export const metadata = {
  title: 'Portfolio | TradeX',
  description: 'Manage your investment portfolio and get AI-powered insights.',
};

async function PortfolioContent() {
  const [holdings, stats, insights] = await Promise.all([
    getPortfolioHoldings().catch(() => []),
    getPortfolioStats().catch(() => null),
    generatePortfolioSummary().catch(() => null),
  ]);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 min-h-screen">
        <PortfolioToolbar />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 pb-20">
      <PortfolioToolbar />
      
      <PortfolioHero stats={stats} />
      
      <PortfolioStats stats={stats} />

      {/* Main Insights and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioChart />
        <AllocationChart />
      </div>

      <AIInsights insights={insights} />

      {/* Holdings Section */}
      <div className="space-y-4">
        <PortfolioFilters />
        <HoldingsTable holdings={holdings} />
      </div>

      {/* Analytics, Goals, and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PerformanceChart />
        <TransactionsTimeline />
        <div className="flex flex-col gap-6">
          <GoalsCard />
          <DividendCard />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <main className="w-full bg-background relative min-h-screen">
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
