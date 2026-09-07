"use client";

import * as React from "react";
import { Plus, Send, Users, Calendar, UserCheck } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import type { Client } from "@/features/clients/types/client.types";

interface CustomizeClientSectionProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onOpenCreateClientModal: () => void;
  travelDate: string;
  onTravelDateChange: (val: string) => void;
  adults: number;
  onAdultsChange: (val: number) => void;
  childrenCount: number;
  onChildrenCountChange: (val: number) => void;
  initialSource: string;
  isSubmittingInquiry: boolean;
  onSubmitInquiry: () => Promise<void>;
}

export function CustomizeClientSection({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenCreateClientModal,
  travelDate,
  onTravelDateChange,
  adults,
  onAdultsChange,
  childrenCount,
  onChildrenCountChange,
  initialSource,
  isSubmittingInquiry,
  onSubmitInquiry,
}: CustomizeClientSectionProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-bold text-app-fg font-display-md flex items-center gap-2">
        <Users className="w-4 h-4 text-app-brand" />
        Client & Inquiry Details
      </h2>

      <Card className="p-6 border-app-border/80 flex flex-col gap-5">
        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center justify-between">
            <span>Select Client Record *</span>
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
        </div>

        <Input
          label="Travel Start Date *"
          type="date"
          value={travelDate}
          onChange={(e): void => {
            onTravelDateChange(e.target.value);
          }}
          icon={Calendar}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Adult Travelers *"
            type="number"
            min={1}
            value={adults === 0 ? "" : adults}
            onChange={(e): void => {
              const val = parseInt(e.target.value, 10);
              onAdultsChange(Number.isNaN(val) ? 1 : Math.max(1, val));
            }}
            icon={UserCheck}
          />
          <Input
            label="Child Travelers"
            type="number"
            min={0}
            value={childrenCount}
            onChange={(e): void => {
              const val = parseInt(e.target.value, 10);
              onChildrenCountChange(Number.isNaN(val) ? 0 : Math.max(0, val));
            }}
            icon={Users}
          />
        </div>

        <div className="border-t border-app-border/40 pt-4 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-app-muted">Departure City:</span>
            <span className="font-semibold text-app-fg">{initialSource}</span>
          </div>
        </div>

        <div className="border-t border-app-border/40 pt-4">
          <Button
            type="button"
            onClick={(): void => {
              void onSubmitInquiry();
            }}
            disabled={isSubmittingInquiry || !selectedClientId || !travelDate}
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
