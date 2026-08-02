'use client';

import { Button } from '@/components/ui/button';
import { Plus, Download, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function PortfolioToolbar() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage your investments.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2 h-9">
          <RefreshCw className="w-4 h-4" />
          Rebalance
        </Button>
        
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 h-9">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Report
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Tax Statement</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
          <Share2 className="w-4 h-4" />
        </Button>

        <Button size="sm" className="gap-2 h-9">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Holding</span>
          <span className="inline sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}
