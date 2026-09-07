"use client";

import * as React from "react";
import { Lock } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import type { Inquiry } from "@/features/inquiries/services/inquiries-api.slice";

export interface HotelSelectionSnapshot {
  dayNumber?: number;
  hotelName?: string;
  roomTypeName?: string;
  numberOfRooms?: number;
  numberOfExtraBeds?: number;
  roomPrice?: number;
  extraBedPrice?: number;
  nights?: number;
  calculatedTotal?: number;
  hotel?: { name: string };
  roomType?: { name: string; price?: number; extraBedPrice?: number };
}

interface PackageSnapshot {
  packageName?: string;
  clientName?: string;
  destinationName?: string;
  hotelSelections?: HotelSelectionSnapshot[];
}

interface HotelBreakdownCardProps {
  inquiry: Inquiry;
  snap: PackageSnapshot;
}

export function HotelBreakdownCard({
  inquiry,
  snap,
}: HotelBreakdownCardProps): React.JSX.Element {
  const selections: HotelSelectionSnapshot[] =
    inquiry.hotelSelections && inquiry.hotelSelections.length > 0
      ? inquiry.hotelSelections
      : (snap.hotelSelections ?? []);

  return (
    <Card className="p-6 border-app-border/80 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-app-border/40 pb-3">
        <div>
          <span className="text-[10px] text-app-brand uppercase font-bold tracking-wider flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked Package Snapshot
          </span>
          <h3 className="text-base font-bold text-app-fg">
            {snap.packageName ?? inquiry.package?.packageName}
          </h3>
        </div>
        <Badge variant="muted">{inquiry.days} Days</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-app-surface-variant/40 border border-app-border/40 text-xs">
        <div>
          <span className="text-[10px] text-app-muted block">Source:</span>
          <span className="font-semibold text-app-fg">{inquiry.source}</span>
        </div>
        <div>
          <span className="text-[10px] text-app-muted block">Destination:</span>
          <span className="font-semibold text-app-fg">
            {inquiry.destination?.name ?? snap.destinationName}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-app-muted block">Travel Date:</span>
          <span className="font-semibold text-app-fg">
            {new Date(inquiry.travelDate).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-app-muted block">Guests:</span>
          <span className="font-semibold text-app-fg">
            {inquiry.adults} Adults, {inquiry.children} Children
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-app-fg uppercase tracking-wider flex items-center justify-between">
          <span>Daily Itinerary & Price Breakdown</span>
          <span className="text-[10px] text-app-muted normal-case font-normal">
            {selections.length} Day(s) Allocated
          </span>
        </h4>
        {selections.map((sel: HotelSelectionSnapshot, idx: number) => {
          const dayNum = sel.dayNumber ?? idx + 1;
          const hName = sel.hotel?.name ?? sel.hotelName ?? "N/A";
          const rName = sel.roomType?.name ?? sel.roomTypeName ?? "N/A";
          const rooms = sel.numberOfRooms ?? 1;
          const beds = sel.numberOfExtraBeds ?? 0;
          const rPrice = sel.roomPrice ?? sel.roomType?.price ?? 0;
          const bPrice = sel.extraBedPrice ?? sel.roomType?.extraBedPrice ?? 0;
          const nights = sel.nights ?? 1;
          const calculatedTotal =
            sel.calculatedTotal ?? (rooms * rPrice + beds * bPrice) * nights;

          const roomSubtotal = rooms * rPrice * nights;
          const bedSubtotal = beds * bPrice * nights;

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-app-border/60 bg-app-surface flex flex-col gap-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-app-brand bg-app-brand/10 px-2.5 py-0.5 rounded-full text-[11px]">
                    Day {dayNum}
                  </span>
                  <strong className="text-app-fg text-sm">{hName}</strong>
                  <span className="text-app-muted text-xs">• {rName}</span>
                </div>
                <span className="text-base font-extrabold text-app-fg">
                  ${calculatedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-app-surface-variant/30 p-3 rounded-xl border border-app-border/30">
                <div className="flex justify-between items-center text-app-fg">
                  <span className="text-app-muted">
                    Rooms: <strong className="text-app-fg">{rooms}</strong> × $
                    {rPrice.toLocaleString()}
                    /night × {nights} night(s)
                  </span>
                  <span className="font-semibold">${roomSubtotal.toLocaleString()}</span>
                </div>
                {beds > 0 ? (
                  <div className="flex justify-between items-center text-app-fg">
                    <span className="text-app-muted">
                      Extra Beds: <strong className="text-app-fg">{beds}</strong> × $
                      {bPrice.toLocaleString()}
                      /night × {nights} night(s)
                    </span>
                    <span className="font-semibold">${bedSubtotal.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-app-muted text-[11px]">
                    <span>Extra Beds: None</span>
                    <span>$0</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
