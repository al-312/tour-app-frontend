import * as React from "react";

import Card from "@/components/ui/card";

const REVENUE_BARS = [
  { label: "Nordic", height: "h-[90%]" },
  { label: "Kyoto", height: "h-[35%]" },
  { label: "Patag", height: "h-[15%]" },
  { label: "Bali", height: "h-[20%]" },
  { label: "Swiss", height: "h-[55%]" },
];

export default function AnalyticsChart(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col gap-6 p-8">
        <div>
          <h3 className="text-sm font-bold text-app-muted uppercase tracking-wider font-label-caps mb-1">
            Excursion Revenue Distribution
          </h3>
          <p className="text-xs text-app-muted">
            Sales values across active premium itineraries
          </p>
        </div>

        <div className="h-64 flex items-end gap-3 pt-6 border-b border-l border-app-border/40 pl-4 pb-2">
          {REVENUE_BARS.map((bar) => (
            <div
              key={bar.label}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
            >
              <div
                className={`w-full bg-app-brand/20 dark:bg-app-brand/10 border-t border-app-brand hover:bg-app-brand/35 transition-colors duration-200 rounded-t-lg ${bar.height}`}
              />
              <span className="text-[10px] text-app-muted font-bold font-mono">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-6 p-8">
        <div>
          <h3 className="text-sm font-bold text-app-muted uppercase tracking-wider font-label-caps mb-1">
            Itinerary Interest Growth
          </h3>
          <p className="text-xs text-app-muted">
            Monthly unique request volume indicators
          </p>
        </div>

        <div className="h-64 flex items-center justify-center border border-dashed border-app-border rounded-xl">
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <div className="w-2.5 h-2.5 rounded-full bg-app-brand animate-ping" />
            <span className="text-xs font-bold text-app-fg mt-2">
              Real-time Metrics Connecting
            </span>
            <span className="text-[10px] text-app-muted max-w-xs">
              Synchronizing with Global GDS database streams for accurate trend
              indicators.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
