"use client";

import * as React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface AdminReviewControlsProps {
  approvedTotal: number;
  onApprovedTotalChange: (val: number) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  isUpdating: boolean;
  onUpdateStatus: (status: string) => Promise<void>;
}

export function AdminReviewControls({
  approvedTotal,
  onApprovedTotalChange,
  notes,
  onNotesChange,
  isUpdating,
  onUpdateStatus,
}: AdminReviewControlsProps): React.JSX.Element {
  return (
    <div className="border-t border-app-border/40 pt-4 flex flex-col gap-4">
      <h4 className="text-xs font-bold text-app-fg uppercase tracking-wider">
        Admin Review Controls
      </h4>

      <div>
        <label className="block text-xs font-semibold text-app-fg mb-1">
          Approved Price (USD)
        </label>
        <Input
          type="number"
          value={approvedTotal}
          onChange={(e): void => {
            const val = parseFloat(e.target.value);
            onApprovedTotalChange(Number.isNaN(val) ? 0 : val);
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-app-fg mb-1">
          Internal Admin Notes
        </label>
        <textarea
          rows={3}
          placeholder="Add approval or changes request notes..."
          value={notes}
          onChange={(e): void => {
            onNotesChange(e.target.value);
          }}
          className="w-full p-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          onClick={(): void => {
            void onUpdateStatus("APPROVED");
          }}
          disabled={isUpdating}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Approve Inquiry</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={(): void => {
            void onUpdateStatus("CHANGES_REQUESTED");
          }}
          disabled={isUpdating}
          className="w-full gap-2"
        >
          <Clock className="w-4 h-4" />
          <span>Request Changes</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={(): void => {
            void onUpdateStatus("REJECTED");
          }}
          disabled={isUpdating}
          className="w-full text-red-600 hover:bg-red-500/10 border-red-500/20 gap-2"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject Inquiry</span>
        </Button>
      </div>
    </div>
  );
}
