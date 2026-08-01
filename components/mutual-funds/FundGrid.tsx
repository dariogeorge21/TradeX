"use client";

import { FundCard, type FundCardProps } from "./FundCard";
import { motion } from "framer-motion";

interface FundGridProps {
  funds: FundCardProps[];
  title?: string;
  description?: string;
}

export function FundGrid({ funds, title, description }: FundGridProps) {
  if (!funds?.length) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-foreground/20 bg-card/20">
        <p className="text-sm text-muted-foreground">No funds available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {funds.map((fund, index) => (
          <motion.div
            key={fund.fundCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <FundCard {...fund} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
