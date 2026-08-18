"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks";
import {
  useGetBookingsQuery,
  useCreateBookingMutation,
} from "@/redux/services/bookingsApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Booking } from "@/types/booking";

function BookingRow({ booking }: { booking: Booking }): React.JSX.Element {
  const badgeVariant =
    booking.status === "confirmed"
      ? "brand"
      : booking.status === "pending"
        ? "muted"
        : "error";

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-semibold text-app-brand">
        {booking.id}
      </TableCell>
      <TableCell className="font-semibold text-app-fg text-sm">
        {booking.excursion}
      </TableCell>
      <TableCell className="text-app-muted text-sm">{booking.client}</TableCell>
      <TableCell className="text-app-muted text-xs">{booking.date}</TableCell>
      <TableCell className="font-extrabold text-app-fg text-sm">
        {booking.amount}
      </TableCell>
      <TableCell className="text-right">
        <Badge variant={badgeVariant}>{booking.status}</Badge>
      </TableCell>
    </TableRow>
  );
}

export default function BookingsTable(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { data: bookings = [], isLoading, isError } = useGetBookingsQuery(undefined);
  const [createBooking] = useCreateBookingMutation();
  const apiQueriesCount = useAppSelector(
    (state) => Object.keys(state.api.queries).length
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void dispatch({ type: "DEBUG_INIT" });
      void store.getState();
      void createBooking;
    }
  }, [dispatch, store, createBooking]);

  if (isLoading) {
    return (
      <Card className="p-8 border border-app-border bg-app-surface shadow-sm flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-app-brand animate-spin" />
        <span className="text-xs font-medium text-app-muted">
          Fetching live bookings via RTK Query (queries: {apiQueriesCount})...
        </span>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 border border-app-border bg-app-surface text-app-error text-center">
        <span className="text-sm font-semibold">Error loading bookings.</span>
      </Card>
    );
  }

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
          {bookings.map((booking: Booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
