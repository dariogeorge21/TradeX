import { Skeleton } from "@/components/ui/skeleton";

export function WatchlistSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[200px] rounded-3xl bg-white/5" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-32 rounded-2xl bg-white/5" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex justify-between items-center py-4">
        <Skeleton className="w-64 h-10 rounded-xl bg-white/5" />
        <Skeleton className="w-32 h-10 rounded-xl bg-white/5" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="w-full h-64 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
