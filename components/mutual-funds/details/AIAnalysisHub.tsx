"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface AIAnalysisProps {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suitableInvestors?: string[];
}

export function AIAnalysisHub({ analysis }: { analysis?: AIAnalysisProps }) {
  if (!analysis) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-md border-emerald-500/20 shadow-lg shadow-emerald-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="pb-3 border-b border-foreground/5 bg-foreground/[0.02]">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            TradeX AI Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {analysis.summary && (
            <div className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Target className="h-4 w-4" /> Strengths
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" /> Risks & Weaknesses
                </div>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {analysis.suitableInvestors && analysis.suitableInvestors.length > 0 && (
            <div className="pt-4 border-t border-foreground/5">
              <div className="flex items-center gap-2 font-semibold mb-3 text-blue-600 dark:text-blue-400">
                <Lightbulb className="h-4 w-4" /> Who should invest?
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis.suitableInvestors.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
