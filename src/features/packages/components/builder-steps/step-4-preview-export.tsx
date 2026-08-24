"use client";

import * as React from "react";
import { Sparkles, ChevronLeft, Building2, User, Phone, Mail } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import type { DayItineraryItem } from "./step-2-itinerary";
import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Client } from "@/features/clients/types/client.types";
import type { Consultant } from "@/features/consultants/types/consultant.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface Step4PreviewExportProps {
  mode: "create" | "edit";
  packageName: string;
  startDate: string;
  numberOfDays: number;
  adults: number;
  childrenCount: number;
  status: "CONFIRMED" | "CANCELLED";
  selectedClient?: Client | undefined;
  selectedDestination?: Destination | undefined;
  selectedConsultant?: Consultant | undefined;
  daysData: DayItineraryItem[];
  hotels: Hotel[];
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

export function Step4PreviewExport({
  mode,
  packageName,
  startDate,
  numberOfDays,
  adults,
  childrenCount,
  status,
  selectedClient,
  selectedDestination,
  selectedConsultant,
  daysData,
  hotels,
  isSubmitting,
  onBack,
  onSubmit,
}: Step4PreviewExportProps): React.JSX.Element {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Tour Proposal Preview</h2>
          <p className="text-xs text-muted-foreground">
            Review full tour details before saving.
          </p>
        </div>
      </div>

      {/* Summary Header Card */}
      <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {packageName || "Untitled Package"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedDestination
                ? `${selectedDestination.name}, ${selectedDestination.country}`
                : "No destination selected"}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary uppercase">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
          <div className="bg-background/80 p-3 rounded-lg border border-border">
            <div className="text-muted-foreground font-semibold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-primary" />
              Client
            </div>
            <div className="font-bold text-foreground mt-0.5">
              {selectedClient?.name ?? "N/A"}
            </div>
            {selectedClient?.email ? (
              <div className="text-[11px] text-muted-foreground truncate">
                {selectedClient.email}
              </div>
            ) : null}
          </div>
          <div className="bg-background/80 p-3 rounded-lg border border-border">
            <div className="text-muted-foreground font-semibold">Start Date</div>
            <div className="font-bold text-foreground mt-0.5">{startDate || "TBD"}</div>
          </div>
          <div className="bg-background/80 p-3 rounded-lg border border-border">
            <div className="text-muted-foreground font-semibold">Duration</div>
            <div className="font-bold text-foreground mt-0.5">
              {String(numberOfDays)} Days
            </div>
          </div>
          <div className="bg-background/80 p-3 rounded-lg border border-border">
            <div className="text-muted-foreground font-semibold">Travelers</div>
            <div className="font-bold text-foreground mt-0.5">
              {String(adults)} Adults
              {childrenCount ? `, ${String(childrenCount)} Children` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Days Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Daily Itinerary & Accommodation Schedule
        </h3>

        <div className="space-y-3">
          {daysData.map((d) => {
            const hotelObj = hotels.find((h) => h.id === d.hotelId) ?? hotels[0];
            return (
              <div
                key={d.dayNumber}
                className="p-4 border border-border rounded-xl bg-card space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-primary">
                    Day {String(d.dayNumber)}
                  </span>
                  {hotelObj ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{hotelObj.name}</span>
                      {hotelObj.starRating ? (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          ({"★".repeat(hotelObj.starRating)})
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </div>

                {d.notes ? (
                  <p className="text-xs text-muted-foreground italic pt-1">
                    Note: {d.notes}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consultant Branding */}
      {selectedConsultant ? (
        <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground">
              Prepared By Consultant
            </div>
            <div className="text-sm font-bold text-foreground">
              {selectedConsultant.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedConsultant.designation}
            </div>
          </div>
          <div className="flex flex-col text-xs text-muted-foreground gap-1 text-right">
            {selectedConsultant.phone ? (
              <span className="flex items-center gap-1 justify-end">
                <Phone className="w-3 h-3" /> {selectedConsultant.phone}
              </span>
            ) : null}
            {selectedConsultant.email ? (
              <span className="flex items-center gap-1 justify-end">
                <Mail className="w-3 h-3" /> {selectedConsultant.email}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Action Controls */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={() => {
            void onSubmit();
          }}
          disabled={isSubmitting}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isSubmitting
            ? "Saving Tour Package..."
            : mode === "create"
              ? "Save & Publish Package"
              : "Update Package"}
        </Button>
      </div>
    </Card>
  );
}
