"use client";

import * as React from "react";

import List from "@/components/ui/list";
import Heading from "@/components/ui/heading";
import BookingsTable from "@/features/bookings/components/bookings-table";
import { useGetBookingsQuery } from "@/features/bookings/services/bookings-api.slice";

import type { Booking } from "@/features/bookings/types/booking.types";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BKG-101",
    destination: "Northern Fjords Private Super-Yacht Voyage",
    clientName: "Lord Harrison",
    clientEmail: "harrison@luxuryvoyages.co.uk",
    startDate: "Oct 12, 2026",
    endDate: "Oct 20, 2026",
    amount: 68500,
    status: "CONFIRMED",
  },
  {
    id: "BKG-102",
    destination: "Kyoto Heritage Villa & Tea Ceremony Masterclass",
    clientName: "Dr. Evelyn Vance",
    clientEmail: "vance@vanceresearch.org",
    startDate: "Nov 02, 2026",
    endDate: "Nov 08, 2026",
    amount: 32000,
    status: "CONFIRMED",
  },
  {
    id: "BKG-103",
    destination: "Patagonia Heli-Skiing & Eco-Lodge Sanctuary",
    clientName: "Marcus Sterling",
    clientEmail: "m.sterling@sterlingcap.com",
    startDate: "Dec 15, 2026",
    endDate: "Dec 22, 2026",
    amount: 42000,
    status: "PENDING",
  },
];

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
