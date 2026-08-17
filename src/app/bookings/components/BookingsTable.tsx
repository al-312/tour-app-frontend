import * as React from "react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "@/components/ui/table";

import type { Booking } from "../types/booking";

const BOOKINGS_DATA: Booking[] = [
  {
    id: "B-2901",
    excursion: "The Nordic Nocturne",
    client: "Alex Robinson",
    date: "Aug 12, 2026",
    amount: "$142,500",
    status: "confirmed",
  },
  {
    id: "B-2902",
    excursion: "Kyoto Art Private Tour",
    client: "Eleanor V.",
    date: "Sep 02, 2026",
    amount: "$48,250",
    status: "confirmed",
  },
  {
    id: "B-2903",
    excursion: "Patagonia helicopter Lodge",
    client: "Marcus T.",
    date: "Oct 18, 2026",
    amount: "$18,990",
    status: "pending",
  },
  {
    id: "B-2904",
    excursion: "Balinese Luxury Villa Escape",
    client: "Sarah Jenkins",
    date: "Nov 05, 2026",
    amount: "$22,400",
    status: "confirmed",
  },
  {
    id: "B-2905",
    excursion: "Swiss Alps Private Helicopter",
    client: "David Miller",
    date: "Dec 10, 2026",
    amount: "$75,000",
    status: "cancelled",
  },
];

export default function BookingsTable(): React.JSX.Element {
  return (
    <Card className="p-0 overflow-hidden border border-app-border bg-app-surface shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Booking ID</TableHeadCell>
            <TableHeadCell>Excursion</TableHeadCell>
            <TableHeadCell>Client</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell className="text-right">Status</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {BOOKINGS_DATA.map((booking: Booking): React.JSX.Element => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-xs font-semibold text-app-brand">{booking.id}</TableCell>
              <TableCell className="font-semibold text-app-fg text-sm">{booking.excursion}</TableCell>
              <TableCell className="text-app-muted text-sm">{booking.client}</TableCell>
              <TableCell className="text-app-muted text-xs">{booking.date}</TableCell>
              <TableCell className="font-extrabold text-app-fg text-sm">{booking.amount}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "brand"
                      : booking.status === "pending"
                      ? "muted"
                      : "error"
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
