"use client";

import * as React from "react";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";

import Badge from "@/components/ui/badge";

interface CustomizeHeaderProps {
  durationDays: number;
  packageName: string;
  totalCalculatedPackagePrice: number;
  errorMessage: string | null;
  successMessage: string | null;
}

export function CustomizeHeader({
  durationDays,
  packageName,
  totalCalculatedPackagePrice,
  errorMessage,
  successMessage,
}: CustomizeHeaderProps): React.JSX.Element {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-app-surface border border-app-border/80 rounded-3xl p-6 lg:p-8 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="brand">{durationDays} Days Tour</Badge>
            <Badge variant="muted" className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-app-muted" /> Destination Read-Only
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-app-fg tracking-tight font-display-lg">
            {packageName}
          </h1>
          <p className="text-xs text-app-muted mt-1">
            Customize hotel stays & room allocations for your client.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end bg-app-surface-variant/60 p-4 rounded-2xl border border-app-border/50">
          <span className="text-[10px] text-app-muted uppercase font-bold tracking-wider">
            Total Calculated Price
          </span>
          <span className="text-2xl font-extrabold text-app-brand">
            ${totalCalculatedPackagePrice.toLocaleString()} USD
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </>
  );
}
