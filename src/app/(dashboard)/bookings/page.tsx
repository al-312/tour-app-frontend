"use client";

import * as React from "react";

import List from "@/components/ui/list";
import Heading from "@/components/ui/heading";
import BookingsTable from "@/features/bookings/components/bookings-table";
import { MOCK_BOOKINGS } from "@/features/bookings/constants/bookings.constants";
import { useGetBookingsQuery } from "@/features/bookings/services/bookings-api.slice";

export default function BookingsPage(): React.JSX.Element {
  const { data: apiBookings } = useGetBookingsQuery(undefined);
  const bookings = apiBookings ?? MOCK_BOOKINGS;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={1} size="xl">
          Itinerary Bookings
        </Heading>
        <p className="text-app-muted text-xs font-medium mt-1">
          Manage active client bookings, VIP clearances, and travel schedules.
        </p>
      </div>

      <List
        items={["Confirmed", "Pending Clearance", "In Itinerary Drafting"]}
        keyExtractor={(item): string => item}
        renderItem={(item): React.JSX.Element => (
          <span className="text-xs text-app-muted font-medium">• {item}</span>
        )}
        className="flex-row gap-4 mb-2"
      />

      <BookingsTable bookings={bookings} />
    </div>
  );
}
