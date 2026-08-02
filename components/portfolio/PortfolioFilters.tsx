'use client';

import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function PortfolioFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center w-full my-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search holdings..." 
          className="pl-9 h-10 w-full bg-background"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <Select defaultValue="all">
          <SelectTrigger className="w-[130px] h-10">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assets</SelectItem>
            <SelectItem value="stock">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="value_desc">
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value_desc">Highest Value</SelectItem>
            <SelectItem value="value_asc">Lowest Value</SelectItem>
            <SelectItem value="return_desc">Top Performers</SelectItem>
            <SelectItem value="return_asc">Worst Performers</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
