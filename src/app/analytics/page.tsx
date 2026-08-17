import * as React from "react";

import Heading from "@/components/ui/heading";

import AnalyticsChart from "./components/AnalyticsChart";

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <Heading level={1} variant="display-lg" subheading="Detailed review of active bookings value and popularity trends.">
        Analytics Insights
      </Heading>
      <AnalyticsChart />
    </div>
  );
}
