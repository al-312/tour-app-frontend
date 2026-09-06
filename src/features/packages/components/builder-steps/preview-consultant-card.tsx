"use client";

import * as React from "react";
import { Phone, Mail } from "lucide-react";

import type { Consultant } from "@/features/consultants/types/consultant.types";

interface PreviewConsultantCardProps {
  selectedConsultant: Consultant;
}

export function PreviewConsultantCard({
  selectedConsultant,
}: PreviewConsultantCardProps): React.JSX.Element {
  const consultantFullName = [selectedConsultant.firstName, selectedConsultant.lastName]
    .filter(Boolean)
    .join(" ");
  const consultantDisplayName =
    selectedConsultant.name ??
    (consultantFullName !== "" ? consultantFullName : "Consultant");

  const phoneObj = selectedConsultant.phone;
  const phoneStr = phoneObj
    ? [phoneObj.countryCode, phoneObj.number ?? phoneObj.phoneNumber]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="text-xs font-bold uppercase text-muted-foreground">
          Prepared By Consultant
        </div>
        <div className="text-sm font-bold text-foreground">{consultantDisplayName}</div>
        <div className="text-xs text-muted-foreground">
          {selectedConsultant.designation}
        </div>
      </div>
      <div className="flex flex-col text-xs text-muted-foreground gap-1 text-right">
        {phoneStr ? (
          <span className="flex items-center gap-1 justify-end">
            <Phone className="w-3 h-3" /> {phoneStr}
          </span>
        ) : null}
        {selectedConsultant.email ? (
          <span className="flex items-center gap-1 justify-end">
            <Mail className="w-3 h-3" /> {selectedConsultant.email}
          </span>
        ) : null}
      </div>
    </div>
  );
}
