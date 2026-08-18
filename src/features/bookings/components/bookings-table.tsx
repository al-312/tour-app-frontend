import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import Badge from "@/components/ui/badge";
import Table from "@/components/ui/table";

import { STATUS_VARIANT_MAP } from "../constants/bookings.constants";

import type { Booking, BookingStatus } from "../types/booking.types";

const getStatusBadgeVariant = (
  status: BookingStatus
): "emerald" | "amber" | "rose" | "muted" => STATUS_VARIANT_MAP[status];

function BookingRow({ booking }: { booking: Booking }): React.JSX.Element {
  const variant = getStatusBadgeVariant(booking.status);

  return (
    <Table.Row className="hover:bg-app-surface-variant/40 transition-colors">
      <Table.Cell className="font-semibold text-app-fg">{booking.destination}</Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="font-medium text-app-fg text-xs">{booking.clientName}</span>
          {booking.clientEmail && (
            <span className="text-[11px] text-app-muted">{booking.clientEmail}</span>
          )}
        </div>
      </Table.Cell>
      <Table.Cell className="text-app-muted text-xs">
        {booking.startDate} — {booking.endDate}
      </Table.Cell>
      <Table.Cell className="font-mono font-bold text-app-fg text-xs">
        ${booking.amount.toLocaleString()}
      </Table.Cell>
      <Table.Cell>
        <Badge variant={variant} className="capitalize text-[11px]">
          {booking.status.toLowerCase()}
        </Badge>
      </Table.Cell>
      <Table.Cell className="text-right">
        <button
          type="button"
          aria-label={`Actions for ${booking.destination}`}
          className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </Table.Cell>
    </Table.Row>
  );
}

function BookingsTable({ bookings }: { bookings: Booking[] }): React.JSX.Element {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Destination</Table.Head>
          <Table.Head>Client Details</Table.Head>
          <Table.Head>Travel Dates</Table.Head>
          <Table.Head>Amount</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Action</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default BookingsTable;
