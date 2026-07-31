import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/stocks/SearchBar";

export function DashboardStockSearch() {
  return (
    <Card className="relative overflow-hidden border border-foreground/10 bg-card/60 backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10"
      />
      <CardHeader className="relative">
        <CardTitle>Search Stock</CardTitle>
        <CardDescription>
          Institutional-style snapshot and AI research in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <SearchBar />
      </CardContent>
    </Card>
  );
}

