"use client";

import * as React from "react";
import {
  Calendar,
  Building2,
  BedDouble,
  User,
  MapPin,
  Users as UsersIcon,
  Briefcase,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Modal from "@/components/ui/modal";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

import type { Package } from "../../types/package.types";

interface ViewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
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
      description="Full Tour Package Proposal Details"
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header Summary Banner */}
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
            {pkg.status === "CONFIRMED" ? (
              <Badge variant="emerald" className="gap-1">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </Badge>
            ) : (
              <Badge variant="rose" className="gap-1">
                <XCircle className="w-3 h-3" /> Cancelled
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
              <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
                <User className="w-3 h-3 text-app-brand" /> Client
              </div>
              <div className="font-bold text-app-fg mt-0.5 truncate">
                {pkg.client?.name ??
                  ([pkg.client?.firstName, pkg.client?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                    "Unassigned")}
              </div>
            </div>

            <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
              <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-app-brand" /> Start Date
              </div>
              <div className="font-bold text-app-fg mt-0.5">
                {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : "TBD"}
              </div>
            </div>

            <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
              <div className="text-app-muted font-semibold text-[11px]">Duration</div>
              <div className="font-bold text-app-fg mt-0.5">
                {String(pkg.durationDays)} Days
              </div>
            </div>

            <div className="bg-app-surface p-2.5 rounded-lg border border-app-border/60">
              <div className="text-app-muted font-semibold flex items-center gap-1 text-[11px]">
                <UsersIcon className="w-3 h-3 text-app-brand" /> Travelers
              </div>
              <div className="font-bold text-app-fg mt-0.5">
                {String(pkg.adults ?? 2)} Adults
                {(pkg.children ?? 0) > 0 ? `, ${String(pkg.children)} Children` : ""}
              </div>
            </div>
          </div>
        </div>

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
              {pkg.packageDays.map((day) => {
                const roomTypeObj = day.hotel?.roomTypes?.find(
                  (rt) => rt.id === day.roomTypeId
                );

                return (
                  <div
                    key={day.id}
                    className="p-3.5 rounded-xl border border-app-border/70 bg-app-surface space-y-1.5"
                  >
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
                        <span className="text-xs text-app-muted italic">
                          No hotel assigned
                        </span>
                      )}
                    </div>

                    {day.notes ? (
                      <p className="text-xs text-app-muted italic">Note: {day.notes}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Consultant Information */}
        {pkg.consultant ? (
          <div className="p-3.5 rounded-xl bg-app-surface-variant/60 border border-app-border/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-app-muted flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-app-brand" /> Travel Consultant
              </div>
              <div className="text-xs font-bold text-app-fg mt-0.5">
                {pkg.consultant.name ??
                  ([pkg.consultant.firstName, pkg.consultant.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                    "Unassigned")}
              </div>
              <div className="text-[11px] text-app-muted">
                {pkg.consultant.designation}
              </div>
            </div>
            {(() => {
              const phoneObj =
                typeof pkg.consultant.phone === "object" ? pkg.consultant.phone : null;
              const phoneStr = phoneObj
                ? [phoneObj.countryCode, phoneObj.number ?? phoneObj.phoneNumber]
                    .filter(Boolean)
                    .join(" ")
                : typeof pkg.consultant.phone === "string"
                  ? pkg.consultant.phone
                  : "";

              return (
                <div className="flex flex-col text-[11px] text-app-muted gap-0.5 text-right">
                  {phoneStr ? (
                    <span className="flex items-center gap-1 justify-end">
                      <Phone className="w-3 h-3" /> {phoneStr}
                    </span>
                  ) : null}
                  {pkg.consultant.email ? (
                    <span className="flex items-center gap-1 justify-end">
                      <Mail className="w-3 h-3" /> {pkg.consultant.email}
                    </span>
                  ) : null}
                </div>
              );
            })()}
          </div>
        ) : null}

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
