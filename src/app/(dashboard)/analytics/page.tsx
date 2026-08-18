"use client";

import * as React from "react";

import Heading from "@/components/ui/heading";
import AnalyticsChart from "@/features/analytics/components/analytics-chart";

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={1} size="xl">
          Analytics & Performance
        </Heading>
        <p className="text-app-muted text-xs font-medium mt-1">
          Detailed metrics on portfolio bookings, revenue growth, and conversion rates.
        </p>
      </div>

      <AnalyticsChart />
    </div>
  );
}
