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
  validFrom?: string | undefined;
  validTo?: string | undefined;
  numberOfDays: number;
  adults: number;
  childrenCount: number;
  status: "CONFIRMED" | "CANCELLED" | "EXPIRED";
  selectedClient?: Client | undefined;
  selectedDestination?: Destination | undefined;
  selectedConsultant?: Consultant | undefined;
  daysData: DayItineraryItem[];
  hotels: Hotel[];
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isAdmin?: boolean | undefined;
}

function PreviewHeader({ isAdmin }: { isAdmin: boolean }): React.JSX.Element {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">
          {isAdmin ? "Master Tour Package Preview" : "Tour Proposal Preview"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isAdmin
            ? "Review master package template details before saving."
            : "Review full tour details before saving proposal."}
        </p>
      </div>
    </div>
  );
}

function ClientSummaryBox({ client }: { client: Client }): React.JSX.Element {
  const name =
    client.name ||
    [client.firstName, client.lastName].filter(Boolean).join(" ") ||
    "Assigned Client";
  return (
    <div className="bg-background/80 p-3 rounded-lg border border-border">
      <div className="text-muted-foreground font-semibold flex items-center gap-1">
        <User className="w-3.5 h-3.5 text-primary" />
        Client
      </div>
      <div className="font-bold text-foreground mt-0.5 truncate">{name}</div>
      {client.email ? (
        <div className="text-[11px] text-muted-foreground truncate">{client.email}</div>
      ) : null}
    </div>
  );
}

interface SummaryGridProps {
  isAdmin: boolean;
  selectedClient?: Client | undefined;
  startDate: string;
  validFrom?: string | undefined;
  validTo?: string | undefined;
  numberOfDays: number;
  adults: number;
  childrenCount: number;
}

function SummaryGrid({
  isAdmin,
  selectedClient,
  startDate,
  validFrom,
  validTo,
  numberOfDays,
  adults,
  childrenCount,
}: SummaryGridProps): React.JSX.Element {
  const showClient = !isAdmin && Boolean(selectedClient);
  const showStartDate = !isAdmin && startDate !== "";
  const showDuration = numberOfDays > 0;
  const showTravelers = !isAdmin && adults > 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
      {showClient && selectedClient ? <ClientSummaryBox client={selectedClient} /> : null}

      {showStartDate ? (
        <div className="bg-background/80 p-3 rounded-lg border border-border">
          <div className="text-muted-foreground font-semibold">Start Date</div>
          <div className="font-bold text-foreground mt-0.5">{startDate}</div>
        </div>
      ) : null}

      {validFrom || validTo ? (
        <div className="bg-background/80 p-3 rounded-lg border border-border">
          <div className="text-muted-foreground font-semibold">Validity</div>
          <div className="font-bold text-foreground mt-0.5">
            {validFrom !== "" && validFrom !== undefined ? validFrom : "Open"}
            {validTo ? ` to ${validTo}` : " onwards"}
          </div>
        </div>
      ) : null}

      {showDuration ? (
        <div className="bg-background/80 p-3 rounded-lg border border-border">
          <div className="text-muted-foreground font-semibold">Duration</div>
          <div className="font-bold text-foreground mt-0.5">
            {String(numberOfDays)} Days
          </div>
        </div>
      ) : null}

      {showTravelers ? (
        <div className="bg-background/80 p-3 rounded-lg border border-border">
          <div className="text-muted-foreground font-semibold">Travelers</div>
          <div className="font-bold text-foreground mt-0.5">
            {String(adults)} Adults
            {childrenCount > 0 ? `, ${String(childrenCount)} Children` : ""}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Step4PreviewExport({
  mode,
  packageName,
  startDate,
  validFrom,
  validTo,
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
  isAdmin = false,
}: Step4PreviewExportProps): React.JSX.Element {
  const destinationText = selectedDestination
    ? `${selectedDestination.name}, ${selectedDestination.country}`
    : "No destination selected";

  const showConsultantCard = !isAdmin && Boolean(selectedConsultant);

  return (
    <Card className="p-6 space-y-6">
      <PreviewHeader isAdmin={isAdmin} />

      <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {packageName !== "" ? packageName : "Untitled Package"}
            </h3>
            <p className="text-xs text-muted-foreground">{destinationText}</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary uppercase">
            {status}
          </span>
        </div>

        <SummaryGrid
          isAdmin={isAdmin}
          selectedClient={selectedClient}
          startDate={startDate}
          validFrom={validFrom}
          validTo={validTo}
          numberOfDays={numberOfDays}
          adults={adults}
          childrenCount={childrenCount}
        />
      </div>

      <PreviewDailyItinerary daysData={daysData} hotels={hotels} />

      {showConsultantCard && selectedConsultant ? (
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
