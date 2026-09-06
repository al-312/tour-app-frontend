"use client";

import * as React from "react";
import { Plus, Send, Users } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import type { Client } from "@/features/clients/types/client.types";

interface CustomizeClientSectionProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onOpenCreateClientModal: () => void;
  initialSource: string;
  initialTravelDate: string;
  initialAdults: number;
  initialChildren: number;
  isSubmittingInquiry: boolean;
  onSubmitInquiry: () => Promise<void>;
}

export function CustomizeClientSection({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenCreateClientModal,
  initialSource,
  initialTravelDate,
  initialAdults,
  initialChildren,
  isSubmittingInquiry,
  onSubmitInquiry,
}: CustomizeClientSectionProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-bold text-app-fg font-display-md flex items-center gap-2">
        <Users className="w-4 h-4 text-app-brand" />
        Client & Submission
      </h2>

      <Card className="p-6 border-app-border/80 flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center justify-between">
            <span>Select Client Record</span>
            <button
              type="button"
              onClick={onOpenCreateClientModal}
              className="text-app-brand hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Client
            </button>
          </label>
          <select
            value={selectedClientId}
            onChange={(e): void => {
              onSelectClient(e.target.value);
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
          >
            <option value="">-- Choose Client --</option>
            {clients.map((c) => {
              const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ");
              const clientDisplayName = c.name
                ? c.name
                : fullName !== ""
                  ? fullName
                  : "Client";
              const phoneVal = c.phone as unknown;
              const phoneObj =
                typeof phoneVal === "object" && phoneVal !== null
                  ? (phoneVal as Record<string, string | undefined>)
                  : null;
              const phoneStr = phoneObj
                ? (phoneObj.number ?? phoneObj.phoneNumber ?? "")
                : typeof phoneVal === "string"
                  ? phoneVal
                  : "";
              const contactInfo = phoneStr !== "" ? phoneStr : (c.email ?? "No contact");

              return (
                <option key={c.id} value={c.id}>
                  {clientDisplayName} ({contactInfo})
                </option>
              );
            })}
          </select>
          <p className="text-[10px] text-app-muted mt-1">
            Clients do not require login credentials and are attached as contact records.
          </p>
        </div>

        <div className="border-t border-app-border/40 pt-4 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-app-muted">Source:</span>
            <span className="font-semibold text-app-fg">{initialSource}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-app-muted">Travel Date:</span>
            <span className="font-semibold text-app-fg">{initialTravelDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-app-muted">Passengers:</span>
            <span className="font-semibold text-app-fg">
              {initialAdults} Adults, {initialChildren} Children
            </span>
          </div>
        </div>

        <div className="border-t border-app-border/40 pt-4">
          <Button
            type="button"
            onClick={(): void => {
              void onSubmitInquiry();
            }}
            disabled={isSubmittingInquiry || !selectedClientId}
            className="w-full gap-2 py-3"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmittingInquiry ? "Submitting Request..." : "Submit Package Inquiry"}
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
