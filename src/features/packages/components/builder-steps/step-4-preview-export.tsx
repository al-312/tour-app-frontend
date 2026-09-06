"use client";

import * as React from "react";
import { Sparkles, ChevronLeft, User } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import { PreviewDailyItinerary } from "./preview-daily-itinerary";
import { PreviewConsultantCard } from "./preview-consultant-card";

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

      <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {packageName !== "" ? packageName : "Untitled Package"}
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
            <div className="font-bold text-foreground mt-0.5">
              {startDate !== "" ? startDate : "TBD"}
            </div>
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

      <PreviewDailyItinerary daysData={daysData} hotels={hotels} />

      {selectedConsultant ? (
        <PreviewConsultantCard selectedConsultant={selectedConsultant} />
      ) : null}

      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={(): void => {
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
