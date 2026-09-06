"use client";

import * as React from "react";
import { User } from "lucide-react";

import Card from "@/components/ui/card";

import type { Inquiry } from "@/features/inquiries/services/inquiries-api.slice";

interface ClientDetailsCardProps {
  inquiry: Inquiry;
  clientDisplayName: string;
  consultantDisplayName: string;
}

export function ClientDetailsCard({
  inquiry,
  clientDisplayName,
  consultantDisplayName,
}: ClientDetailsCardProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="p-5 border-app-border/80 flex flex-col gap-2">
        <span className="text-[10px] text-app-muted uppercase font-bold tracking-wider flex items-center gap-1">
          <User className="w-3 h-3 text-app-brand" /> Client Details
        </span>
        <h3 className="text-sm font-bold text-app-fg">{clientDisplayName}</h3>
        <p className="text-xs text-app-muted">Email: {inquiry.client?.email ?? "N/A"}</p>
        <p className="text-xs text-app-muted">Phone: {inquiry.client?.phone ?? "N/A"}</p>
        <p className="text-xs text-app-muted">
          Country: {inquiry.client?.country ?? "N/A"}
        </p>
      </Card>

      <Card className="p-5 border-app-border/80 flex flex-col gap-2">
        <span className="text-[10px] text-app-muted uppercase font-bold tracking-wider flex items-center gap-1">
          <User className="w-3 h-3 text-app-brand" /> Consultant Details
        </span>
        <h3 className="text-sm font-bold text-app-fg">{consultantDisplayName}</h3>
        <p className="text-xs text-app-muted">
          Email: {inquiry.consultant?.email ?? "N/A"}
        </p>
      </Card>
    </div>
  );
}
