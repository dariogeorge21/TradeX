import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      {/* Header Skeleton */}
      <div 
        className="flex items-center justify-between opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
        style={{ animationDelay: '50ms' }}
      >
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Company Profile Skeleton */}
      <Card 
        className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: '150ms' }}
      >
        <CardHeader className="flex flex-row items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Market Metrics Skeleton */}
          <Card 
            className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: '250ms' }}
          >
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Skeleton */}
          <Card 
            className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: '350ms' }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-12 rounded-md" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </CardContent>
          </Card>

          {/* News Skeleton */}
          <Card 
            className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: '450ms' }}
          >
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-32 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1 py-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-32 mt-4" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Summary Skeleton */}
          <Card 
            className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both border-primary/20"
            style={{ animationDelay: '300ms' }}
          >
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>

          {/* Technical Overview Skeleton */}
          <Card 
            className="bg-card/60 backdrop-blur opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: '400ms' }}
          >
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

