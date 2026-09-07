"use client";

import * as React from "react";
import { Building2, BedDouble, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

import type { Package, PackageDay } from "../../types/package.types";

interface ViewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
}

function PackageSummaryHeader({ pkg }: { pkg: Package }): React.JSX.Element {
  const hasClient = Boolean(pkg.client?.name ?? pkg.client?.firstName);
  const clientDisplayName =
    pkg.client?.name ??
    [pkg.client?.firstName, pkg.client?.lastName].filter(Boolean).join(" ");

  return (
    <div className="p-4 rounded-xl bg-app-surface-variant/80 border border-app-border/80 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-app-fg">{pkg.packageName}</h3>
          <p className="text-xs font-semibold text-app-muted flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-app-brand" />
            {pkg.destination
              ? `${pkg.destination.name}, ${pkg.destination.country}`
              : "No Destination Selected"}
          </p>
        </div>
        {pkg.status === "CONFIRMED" || pkg.status === "ACTIVE" ? (
          <Badge variant="emerald" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />{" "}
            {pkg.status === "ACTIVE" ? "Active" : "Confirmed"}
          </Badge>
        ) : pkg.status === "EXPIRED" ? (
          <Badge variant="amber" className="gap-1">
            <XCircle className="w-3 h-3" /> Expired
          </Badge>
        ) : (
          <Badge variant="rose" className="gap-1">
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
        {hasClient && clientDisplayName ? (
          <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
            <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
              Client
            </div>
            <div className="font-bold text-app-fg mt-0.5 truncate">
              {clientDisplayName}
            </div>
          </div>
        ) : null}

        {pkg.fromDatetimeUtc || pkg.toDatetimeUtc ? (
          <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
            <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
              Validity
            </div>
            <div className="font-bold text-app-fg mt-0.5">
              {pkg.fromDatetimeUtc
                ? new Date(pkg.fromDatetimeUtc).toLocaleDateString()
                : "Open"}
              {pkg.toDatetimeUtc
                ? ` – ${new Date(pkg.toDatetimeUtc).toLocaleDateString()}`
                : " onwards"}
            </div>
          </div>
        ) : null}

        {pkg.startDate && !pkg.fromDatetimeUtc ? (
          <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
            <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
              Start Date
            </div>
            <div className="font-bold text-app-fg mt-0.5">
              {new Date(pkg.startDate).toLocaleDateString()}
            </div>
          </div>
        ) : null}

        <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
          <div className="text-app-muted font-semibold text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-app-brand" /> Package Duration
          </div>
          <div className="font-bold text-app-fg mt-0.5">
            {String(pkg.durationDays)} Days
          </div>
        </div>

        <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
          <div className="text-app-muted font-semibold text-[11px] flex items-center gap-1">
            <Building2 className="w-3 h-3 text-app-brand" /> Configured Days
          </div>
          <div className="font-bold text-app-fg mt-0.5">
            {String(pkg.packageDays.length)} Days
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyScheduleItem({ day }: { day: PackageDay }): React.JSX.Element {
  const roomTypeObj = day.hotel?.roomTypes?.find((rt) => rt.id === day.roomTypeId);

  return (
    <div className="p-3.5 rounded-xl border border-app-border/70 bg-app-surface space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-app-brand">
          Day {String(day.dayNumber)}
        </span>
        {day.hotel ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{day.hotel.name}</span>
              {day.hotel.starRating ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  ({"★".repeat(day.hotel.starRating)})
                </span>
              ) : null}
            </span>

            {roomTypeObj ? (
              <span className="text-xs font-medium text-app-brand bg-app-brand/10 border border-app-brand/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <BedDouble className="w-3 h-3" />
                <span>{roomTypeObj.name}</span>
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-xs text-app-muted italic">No hotel assigned</span>
        )}
      </div>

      {day.notes ? (
        <p className="text-xs text-app-muted italic">Note: {day.notes}</p>
      ) : null}
    </div>
  );
}

export function ViewPackageModal({
  isOpen,
  onClose,
  pkg,
}: ViewPackageModalProps): React.JSX.Element {
  if (!pkg) return <></>;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pkg.packageName}
      description="Master Tour Package Template Details"
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header Summary Banner */}
        <PackageSummaryHeader pkg={pkg} />

        {/* Daily Schedule */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Daily Accommodation Schedule ({pkg.packageDays.length} Days)
          </h4>

          {pkg.packageDays.length === 0 ? (
            <div className="p-4 text-center text-xs text-app-muted italic bg-app-surface-variant/40 rounded-xl border border-app-border/40">
              No itinerary days configured yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pkg.packageDays.map((day) => (
                <DailyScheduleItem key={day.id} day={day} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
