import { IndicatorValue, MACDValue } from "@/types/crypto";
import { Gauge, BarChart, TrendingUp } from "lucide-react";

export function TechnicalIndicatorsPanel({
  rsi,
  macd,
  ema,
}: {
  rsi: IndicatorValue[];
  macd: MACDValue[];
  ema: IndicatorValue[];
}) {
  const latestRsi = rsi.length > 0 ? rsi[rsi.length - 1].value : null;
  const latestMacd = macd.length > 0 ? macd[macd.length - 1] : null;
  const latestEma = ema.length > 0 ? ema[ema.length - 1].value : null;

  // RSI Logic
  let rsiLabel = "Neutral";
  let rsiColor = "text-amber-500";
  if (latestRsi) {
    if (latestRsi >= 70) {
      rsiLabel = "Overbought";
      rsiColor = "text-rose-500";
    } else if (latestRsi <= 30) {
      rsiLabel = "Oversold";
      rsiColor = "text-emerald-500";
    }
  }

  // MACD Logic
  let macdLabel = "Neutral";
  let macdColor = "text-amber-500";
  if (latestMacd) {
    if (latestMacd.histogram > 0) {
      macdLabel = "Bullish Momentum";
      macdColor = "text-emerald-500";
    } else if (latestMacd.histogram < 0) {
      macdLabel = "Bearish Momentum";
      macdColor = "text-rose-500";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* RSI Card */}
      <div className="rounded-xl border border-foreground/10 bg-card/60 p-5 shadow-sm backdrop-blur-md flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-muted-foreground mb-4 w-full justify-center">
          <Gauge className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">RSI (14)</span>
        </div>
        {latestRsi ? (
          <>
            <div className={`text-4xl font-bold font-mono mb-2 ${rsiColor}`}>
              {latestRsi.toFixed(1)}
            </div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full bg-muted ${rsiColor}`}>
              {rsiLabel}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </div>

      {/* MACD Card */}
      <div className="rounded-xl border border-foreground/10 bg-card/60 p-5 shadow-sm backdrop-blur-md flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-muted-foreground mb-4 w-full justify-center">
          <BarChart className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">MACD</span>
        </div>
        {latestMacd ? (
          <>
            <div className={`text-2xl font-bold font-mono mb-2 ${macdColor}`}>
              {latestMacd.histogram > 0 ? "+" : ""}
              {latestMacd.histogram.toFixed(2)}
            </div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full bg-muted ${macdColor}`}>
              {macdLabel}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </div>

      {/* EMA Card */}
      <div className="rounded-xl border border-foreground/10 bg-card/60 p-5 shadow-sm backdrop-blur-md flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-muted-foreground mb-4 w-full justify-center">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">EMA (20)</span>
        </div>
        {latestEma ? (
          <>
            <div className="text-2xl font-bold font-mono mb-2 text-foreground">
              ${latestEma.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
              Trend Baseline
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </div>
    </div>
  );
}
