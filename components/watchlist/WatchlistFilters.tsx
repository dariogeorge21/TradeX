"use client";

import { WatchlistFilters as FiltersType, WatchlistSortOption, AssetType } from "@/types/watchlist";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface WatchlistFiltersProps {
  filters: FiltersType;
  onFiltersChange: (newFilters: FiltersType) => void;
}

export function WatchlistFilters({ filters, onFiltersChange }: WatchlistFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full bg-white/5 border border-white/10 p-4 rounded-2xl">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by symbol or name..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="w-full pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select
          value={filters.assetType || "all"}
          onValueChange={(val) => onFiltersChange({ ...filters, assetType: val === "all" ? undefined : val as AssetType })}
        >
          <SelectTrigger className="w-full md:w-[140px] bg-slate-900/50 border-slate-700 text-white rounded-xl">
            <SelectValue placeholder="All Assets" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="all">All Assets</SelectItem>
            <SelectItem value="stock">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white rounded-xl">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-white">
            <DropdownMenuRadioGroup
              value={filters.sortBy}
              onValueChange={(val) => onFiltersChange({ ...filters, sortBy: val as WatchlistSortOption })}
            >
              <DropdownMenuRadioItem value="newest">Newest Added</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest Added</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetical">Alphabetical (A-Z)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest_gain">Highest Gain Today</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest_loss">Highest Loss Today</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest_price">Highest Price</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lowest_price">Lowest Price</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="most_volatile">Most Volatile</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ai_score">AI Watch Score</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="w-full md:w-auto bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl" title="Advanced Filters">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
