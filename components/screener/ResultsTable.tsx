"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ResultsTableProps {
  data: any[];
}

export function ResultsTable({ data }: ResultsTableProps) {
  
  const formatCurrency = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="w-full overflow-auto rounded-lg border border-neutral-800">
      <Table>
        <TableHeader className="bg-neutral-900/50">
          <TableRow className="border-neutral-800 hover:bg-transparent">
            <TableHead className="w-[250px] font-medium text-neutral-400">Company</TableHead>
            <TableHead className="text-right font-medium text-neutral-400">Price</TableHead>
            <TableHead className="text-right font-medium text-neutral-400">Change</TableHead>
            <TableHead className="text-right font-medium text-neutral-400">Market Cap</TableHead>
            <TableHead className="text-right font-medium text-neutral-400">Volume</TableHead>
            <TableHead className="text-right font-medium text-neutral-400">P/E</TableHead>
            <TableHead className="text-center font-medium text-neutral-400">AI Score</TableHead>
            <TableHead className="text-center font-medium text-neutral-400">Signal</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock) => (
            <TableRow key={stock.id} className="border-neutral-800 hover:bg-neutral-900/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-xs font-bold text-neutral-300">
                    {stock.ticker.substring(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{stock.ticker}</span>
                    <span className="text-xs text-neutral-500 truncate max-w-[150px]">{stock.name}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-white">
                ${stock.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className={`inline-flex items-center gap-1 ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(stock.change)}%
                </div>
              </TableCell>
              <TableCell className="text-right text-neutral-300">
                {formatCurrency(stock.marketCap)}
              </TableCell>
              <TableCell className="text-right text-neutral-300">
                {(stock.volume / 1000000).toFixed(1)}M
              </TableCell>
              <TableCell className="text-right text-neutral-300">
                {stock.pe.toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20">
                  {stock.aiScore}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant="outline" 
                  className={
                    stock.signal === 'Strong Buy' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                    stock.signal === 'Buy' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' :
                    stock.signal === 'Hold' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' :
                    'border-red-500/30 bg-red-500/10 text-red-400'
                  }
                >
                  {stock.signal}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-neutral-800 bg-neutral-900 text-neutral-300">
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer">
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer">
                      Add to Watchlist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer">
                      AI Analysis <ExternalLink className="ml-2 h-3 w-3" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
