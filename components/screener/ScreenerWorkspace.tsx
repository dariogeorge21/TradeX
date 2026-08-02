"use client";

import { useState, useEffect } from "react";
import { ScreenerHero } from "./ScreenerHero";
import { FilterSidebar } from "./FilterSidebar";
import { FilterToolbar } from "./FilterToolbar";
import { ResultsTable } from "./ResultsTable";
import { ResultsGrid } from "./ResultsGrid";
import { AISummary } from "./AISummary";
import { searchStocks } from "@/app/actions/screener";

export type ViewMode = "table" | "grid";

export function ScreenerWorkspace({ initialData }: { initialData: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [results, setResults] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced fetch for filters and search changes
  useEffect(() => {
    let isMounted = true;
    
    setIsLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchStocks(searchQuery, filters);
      if (isMounted) {
        if (res.success) {
          setResults(res.data || []);
        }
        setIsLoading(false);
      }
    }, 300); // 300ms debounce prevents slider spam

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <ScreenerHero onSearch={handleSearch} />
      
      {/* AI Insights - Only show if filters are applied or results are interesting */}
      {(Object.keys(filters).length > 0 || searchQuery) && (
        <AISummary filters={filters} resultCount={results.length} />
      )}

      <div className="flex flex-1 gap-6">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-80 shrink-0">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <FilterToolbar 
            activeFilters={filters}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onClearFilters={clearFilters}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            resultCount={results.length}
          />
          
          <div className="relative flex-1 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-4">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/50 backdrop-blur-sm rounded-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            )}
            
            {results.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-neutral-500">
                <div className="mb-4 text-4xl">🔍</div>
                <h3 className="text-lg font-medium text-white">No results found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="mt-4 text-blue-400 hover:underline">Clear all filters</button>
              </div>
            ) : (
              viewMode === "table" ? (
                <ResultsTable data={results} />
              ) : (
                <ResultsGrid data={results} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
