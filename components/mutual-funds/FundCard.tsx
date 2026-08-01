"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, TrendingDown, Star, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface FundCardProps {
  fundCode: string;
  name: string;
  amc?: string;
  category?: string;
  nav?: number;
  returns1Y?: number;
  returns3Y?: number;
  expenseRatio?: number;
  riskLevel?: string;
  rating?: number;
  minSip?: number;
  aum?: number;
  tags?: string[];
}

function formatCurrency(val?: number) {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);
}

function formatPercent(val?: number) {
  if (val == null) return "—";
  return `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
}

function formatAum(val?: number) {
  if (val == null) return "—";
  if (val >= 1000) return `₹${(val / 1000).toFixed(2)}k Cr`;
  return `₹${val} Cr`;
}

export function FundCard({
  fundCode,
  name,
  amc,
  category,
  nav,
  returns1Y,
  returns3Y,
  expenseRatio,
  riskLevel,
  rating,
  minSip,
  aum,
  tags = [],
}: FundCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCardClick = () => {
    startTransition(() => {
      router.push(`/dashboard/mutual-funds/${encodeURIComponent(fundCode)}`);
    });
  };

  const isPositive1Y = (returns1Y ?? 0) >= 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        onClick={handleCardClick}
        className={`group relative flex h-full flex-col overflow-hidden border border-foreground/10 bg-card/60 backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 ${
          isPending ? "pointer-events-none" : ""
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-xs transition-all">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 drop-shadow-md" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
        
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="bg-background/50 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border-foreground/10">
              {category || "Equity"}
            </Badge>
            {rating && (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {rating} <Star className="h-3 w-3 fill-amber-500" />
              </div>
            )}
          </div>
          <CardTitle className="space-y-1.5">
            <h3 className="line-clamp-2 font-bold text-lg leading-tight text-foreground group-hover:text-emerald-500 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-xs font-medium text-muted-foreground line-clamp-1">{amc}</p>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 py-3 grow flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">1Y Return</p>
              <div className={`flex items-center gap-1.5 font-mono text-lg font-bold tracking-tight ${isPositive1Y ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive1Y ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercent(returns1Y)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">3Y Return</p>
              <div className="font-mono text-lg font-bold tracking-tight text-foreground">
                {formatPercent(returns3Y)}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">NAV</p>
              <div className="font-mono text-sm font-semibold text-foreground">
                {formatCurrency(nav)}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fund Size</p>
              <div className="font-mono text-sm font-semibold text-foreground">
                {formatAum(aum)}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 py-3 border-t border-foreground/5 bg-foreground/[0.02] flex items-center justify-between mt-auto">
           <div className="flex items-center gap-2">
             <div className="text-[10px] text-muted-foreground">
               <span className="font-semibold text-foreground/80">Exp:</span> {expenseRatio ? `${expenseRatio}%` : '—'}
             </div>
             <div className="w-1 h-1 rounded-full bg-foreground/20" />
             <div className="text-[10px] text-muted-foreground flex items-center gap-1">
               <AlertCircle className="h-3 w-3" />
               <span className="capitalize">{riskLevel?.toLowerCase() || '—'}</span>
             </div>
           </div>
           
           <div className="text-[10px] text-muted-foreground">
             <span className="font-semibold text-foreground/80">Min SIP:</span> {minSip ? formatCurrency(minSip) : '—'}
           </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
