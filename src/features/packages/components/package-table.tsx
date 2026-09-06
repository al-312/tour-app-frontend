"use client";

import * as React from "react";
import {
  Ban,
  Briefcase,
  Edit3,
  Eye,
  Filter,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users as UsersIcon,
} from "lucide-react";

import Table from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

import type { Package, PackageStatus } from "../types/package.types";

interface PackageTableProps {
  packages: Package[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenCreate: () => void;
  onOpenEdit: (pkg: Package) => void;
  onOpenDelete: (pkg: Package) => void;
  onOpenView: (pkg: Package) => void;
  onCancelPackage: (pkg: Package) => void;
}

function StatusBadge({ status }: { status: PackageStatus }): React.JSX.Element {
  switch (status) {
    case "CONFIRMED":
      return <Badge variant="emerald">Confirmed</Badge>;
    case "CANCELLED":
      return <Badge variant="rose">Cancelled</Badge>;
    default:
      return <Badge variant="muted">{status}</Badge>;
  }
}

export function PackageTable({
  packages,
  statusFilter,
  onStatusFilterChange,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onOpenView,
  onCancelPackage,
}: PackageTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return packages.filter((p) => {
      const clientName =
        p.client?.name ??
        [p.client?.firstName, p.client?.lastName].filter(Boolean).join(" ");
      const consultantName =
        p.consultant?.name ??
        [p.consultant?.firstName, p.consultant?.lastName].filter(Boolean).join(" ");
      const destName = p.destination?.name ?? "";

      return (
        p.packageName.toLowerCase().includes(search.toLowerCase()) ||
        clientName.toLowerCase().includes(search.toLowerCase()) ||
        consultantName.toLowerCase().includes(search.toLowerCase()) ||
        destName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [packages, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 grow max-w-xl">
          <div className="relative grow">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by package name, client, or destination..."
              className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
            />
            <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                onStatusFilterChange(e.target.value);
              }}
              className="w-full sm:w-40 pl-9 pr-8 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm font-semibold text-app-fg outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-app-surface text-app-fg">
                All Statuses
              </option>
              <option value="CONFIRMED" className="bg-app-surface text-app-fg">
                Confirmed
              </option>
              <option value="CANCELLED" className="bg-app-surface text-app-fg">
                Cancelled
              </option>
            </select>
            <Filter className="w-3.5 h-3.5 text-app-muted absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Create Package</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <PackageCheck className="w-8 h-8 text-app-muted mb-2" />
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No tour packages found
          </h4>
          <p className="text-xs text-app-muted mt-1 max-w-sm">
            No packages match your search or filter parameters. Try clearing your search
            or create a new package.
          </p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Package Details</Table.Head>
              <Table.Head>Client</Table.Head>
              <Table.Head>Destination</Table.Head>
              <Table.Head>Travelers</Table.Head>
              <Table.Head>User</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((pkg) => (
              <Table.Row key={pkg.id}>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="font-bold text-app-fg text-sm">
                      {pkg.packageName}
                    </span>
                    <span className="text-xs text-app-muted font-medium mt-0.5">
                      {String(pkg.durationDays)} Days
                      {pkg.startDate
                        ? ` • Starts ${new Date(pkg.startDate).toLocaleDateString()}`
                        : ""}
                    </span>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  {pkg.client ? (
                    <div className="flex items-center gap-1.5 text-xs text-app-fg font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-app-muted shrink-0" />
                      <span>
                        {pkg.client.name ||
                          [pkg.client.firstName, pkg.client.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                          "Unassigned"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-app-muted italic">Unassigned</span>
                  )}
                </Table.Cell>

                <Table.Cell>
                  {pkg.destination ? (
                    <div className="flex items-center gap-1.5 text-xs text-app-fg font-medium">
                      <MapPin className="w-3.5 h-3.5 text-app-brand shrink-0" />
                      <span>
                        {pkg.destination.name}, {pkg.destination.country}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-app-muted italic">Unassigned</span>
                  )}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-1.5 text-xs text-app-fg font-medium">
                    <UsersIcon className="w-3.5 h-3.5 text-app-muted shrink-0" />
                    <span>
                      {String(pkg.adults ?? 2)} Adult{(pkg.adults ?? 2) > 1 ? "s" : ""}
                      {(pkg.children ?? 0) > 0
                        ? `, ${String(pkg.children)} Child${(pkg.children ?? 0) > 1 ? "ren" : ""}`
                        : ""}
                    </span>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-1.5 text-xs text-app-fg font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-app-muted shrink-0" />
                    <span>
                      {pkg.consultant?.name ??
                        ([pkg.consultant?.firstName, pkg.consultant?.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                          "User")}
                    </span>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <StatusBadge status={pkg.status} />
                </Table.Cell>

                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onOpenView(pkg);
                      }}
                      title="View details"
                    >
                      <Eye className="w-3.5 h-3.5 text-app-brand" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onOpenEdit(pkg);
                      }}
                      title="Edit package"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>

                    {pkg.status === "CONFIRMED" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onCancelPackage(pkg);
                        }}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                        title="Cancel package"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onOpenDelete(pkg);
                      }}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      title="Delete package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
