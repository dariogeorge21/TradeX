'use client';

import * as React from 'react';
import { PortfolioHolding } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof PortfolioHolding; direction: 'asc' | 'desc' } | null>(null);

  const sortedHoldings = React.useMemo(() => {
    let sortableHoldings = [...holdings];
    if (sortConfig !== null) {
      sortableHoldings.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue == null || bValue == null) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableHoldings;
  }, [holdings, sortConfig]);

  const requestSort = (key: keyof PortfolioHolding) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'High': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Current Holdings</CardTitle>
          <CardDescription>Detailed view of your investments</CardDescription>
        </div>
        <Button variant="outline" size="sm">Download CSV</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[200px]">
                  <Button variant="ghost" onClick={() => requestSort('company_name')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                    Company <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">CMP</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => requestSort('market_value')} className="-mr-4 h-8 justify-end w-full">
                    Market Value <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => requestSort('today_change')} className="-mr-4 h-8 justify-end w-full">
                    Today's Chg <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => requestSort('overall_return')} className="-mr-4 h-8 justify-end w-full">
                    Overall Ret <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Risk</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHoldings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No holdings found. Add your first investment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                sortedHoldings.map((holding) => {
                  const isTodayPositive = (holding.today_change || 0) >= 0;
                  const isOverallPositive = (holding.overall_return || 0) >= 0;

                  return (
                    <TableRow key={holding.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{holding.ticker}</span>
                          <span className="text-xs text-muted-foreground font-normal truncate max-w-[180px]">
                            {holding.company_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{holding.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">${holding.average_buy_price.toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums">${holding.current_price.toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        ${holding.market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <div className={`flex flex-col items-end ${isTodayPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <span className="flex items-center gap-1">
                            {isTodayPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isTodayPositive ? '+' : ''}{holding.today_change?.toFixed(2)}
                          </span>
                          <span className="text-xs opacity-80">
                            {isTodayPositive ? '+' : ''}{holding.today_change_percent?.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <div className={`flex flex-col items-end ${isOverallPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <span className="font-medium">
                            {isOverallPositive ? '+' : ''}{holding.overall_return?.toFixed(2)}
                          </span>
                          <span className="text-xs opacity-80">
                            {isOverallPositive ? '+' : ''}{holding.overall_return_percent?.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`font-normal ${getRiskColor(holding.risk_level || '')}`}>
                          {holding.risk_level || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Add Transaction</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>AI Analysis</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete Holding</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
