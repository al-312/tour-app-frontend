import * as React from "react";
import { TrendingUp, Award, Clock } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Heading from "@/components/ui/heading";

import { MONTHLY_DATA } from "../constants/analytics.constants";

function AnalyticsChart(): React.JSX.Element {
  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={3} size="lg">
              Revenue Growth
            </Heading>
            <p className="text-app-muted text-xs font-medium">
              Gross portfolio bookings volume (USD)
            </p>
          </div>
          <Badge variant="emerald" className="gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% YTD</span>
          </Badge>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-app-border/40">
          {MONTHLY_DATA.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-full bg-app-surface-variant rounded-t-xl overflow-hidden flex items-end h-48">
                  <div
                    style={{ height: `${String(heightPercent)}%` }}
                    className="w-full bg-linear-to-t from-app-brand to-emerald-500 rounded-t-xl group-hover:brightness-110 transition-all duration-300 shadow-md shadow-app-brand/20"
                  />
                </div>
                <span className="text-xs font-semibold text-app-muted group-hover:text-app-fg transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-2 bg-linear-to-br from-app-surface to-app-surface-variant/40">
          <div className="flex items-center justify-between text-app-muted">
            <span className="text-xs font-bold uppercase tracking-wider font-label-caps">
              Average Deal Size
            </span>
            <Award className="w-4 h-4 text-app-brand" />
          </div>
          <p className="text-3xl font-extrabold text-app-fg tracking-tight font-display-lg">
            $18,450
          </p>
          <p className="text-xs text-emerald-500 font-medium">
            ↑ +12.3% higher than regional average
          </p>
        </Card>

        <Card className="flex flex-col gap-2 bg-linear-to-br from-app-surface to-app-surface-variant/40">
          <div className="flex items-center justify-between text-app-muted">
            <span className="text-xs font-bold uppercase tracking-wider font-label-caps">
              Conversions
            </span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-extrabold text-app-fg tracking-tight font-display-lg">
            68.4%
          </p>
          <p className="text-xs text-app-muted font-medium">
            Inquiry to confirmed itinerary rate
          </p>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsChart;
