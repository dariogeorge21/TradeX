"use client";

import { Filter, LayoutGrid, List, X, Download, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewMode } from "./ScreenerWorkspace";

interface FilterToolbarProps {
  activeFilters: Record<string, any>;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onClearFilters: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  resultCount: number;
}

export function FilterToolbar({
  activeFilters,
  viewMode,
  onViewChange,
  onClearFilters,
  onToggleSidebar,
  isSidebarOpen,
  resultCount
}: FilterToolbarProps) {
  const filterCount = Object.keys(activeFilters).length;

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-md backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleSidebar}
          className={`h-9 border-neutral-800 bg-neutral-900 ${isSidebarOpen ? 'text-blue-400' : 'text-neutral-400'}`}
        >
          <Filter className="mr-2 h-4 w-4" />
          {isSidebarOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        
        <div className="h-4 w-px bg-neutral-800" />
        
        <div className="text-sm font-medium text-neutral-300">
          {resultCount.toLocaleString()} <span className="text-neutral-500">Matches</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {filterCount > 0 && (
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs text-neutral-500">Active:</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
              {filterCount} Filters
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 px-2 text-xs text-neutral-400 hover:text-red-400">
              Clear All
            </Button>
          </div>
        )}

        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange("table")}
            className={`h-7 w-8 p-0 ${viewMode === "table" ? "bg-neutral-800 text-white" : "text-neutral-500"}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange("grid")}
            className={`h-7 w-8 p-0 ${viewMode === "grid" ? "bg-neutral-800 text-white" : "text-neutral-500"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-neutral-800 hidden md:block" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-neutral-800 bg-neutral-900 text-neutral-300">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-neutral-800 bg-neutral-900 text-neutral-300">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
}
