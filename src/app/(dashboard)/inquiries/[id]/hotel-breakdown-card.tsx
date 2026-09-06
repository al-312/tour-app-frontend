"use client";

import * as React from "react";
import { Lock } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import type { Inquiry } from "@/features/inquiries/services/inquiries-api.slice";

interface HotelSelectionSnapshot {
  dayNumber?: number;
  hotelName?: string;
  roomTypeName?: string;
  numberOfRooms?: number;
  numberOfExtraBeds?: number;
  calculatedTotal?: number;
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
        <h4 className="text-xs font-bold text-app-fg uppercase tracking-wider">
          Hotel & Room Allocation Breakdown
        </h4>
        {(snap.hotelSelections ?? []).map((sel: HotelSelectionSnapshot, idx: number) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-app-border/60 bg-app-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-app-brand bg-app-brand/10 px-2 py-0.5 rounded-full text-[10px]">
                  Day {sel.dayNumber ?? idx + 1}
                </span>
                <strong className="text-app-fg text-sm">{sel.hotelName ?? "N/A"}</strong>
              </div>
              <span className="text-app-muted block">
                Room Type: {sel.roomTypeName ?? "N/A"}
              </span>
              <span className="text-app-brand font-semibold block mt-0.5">
                Allocation: {sel.numberOfRooms ?? 0} Room(s)
                {(sel.numberOfExtraBeds ?? 0) > 0
                  ? ` + ${(sel.numberOfExtraBeds ?? 0).toString()} Extra Bed`
                  : ""}
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-app-fg">
                ${(sel.calculatedTotal ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
