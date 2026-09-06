"use client";

import * as React from "react";
import { Mail, User } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

import type { Consultant } from "@/features/consultants/types/consultant.types";

interface PreviewConsultantCardProps {
  selectedConsultant?: Consultant | undefined;
}

export function PreviewConsultantCard({
  selectedConsultant,
}: PreviewConsultantCardProps): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  const displayName = user?.name ?? selectedConsultant?.name ?? "Assigned User";
  const email = user?.email ?? selectedConsultant?.email;
  const role = user?.role ?? "User";

  return (
    <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" />
          Prepared By User
        </div>
        <div className="text-sm font-bold text-foreground mt-0.5">{displayName}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
      <div className="flex flex-col text-xs text-muted-foreground gap-1 text-right">
        {email ? (
          <span className="flex items-center gap-1 justify-end">
            <Mail className="w-3 h-3" /> {email}
          </span>
        ) : null}
      </div>
    </div>
  );
}
