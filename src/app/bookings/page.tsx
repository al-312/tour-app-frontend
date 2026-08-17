import * as React from "react";

import Heading from "@/components/ui/heading";

import BookingsTable from "./components/BookingsTable";

export default function BookingsPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <Heading level={1} variant="display-lg" subheading="Review, confirm, or modify real-time premium travel bookings.">
        Bookings
      </Heading>
      <BookingsTable />
    </div>
  );
}
