"use client";

import Link from "next/link";
import * as React from "react";
import { FileText, Search, Eye } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { useGetInquiriesQuery } from "@/features/inquiries/services/inquiries-api.slice";

interface PackageSnapshotPartial {
  packageName?: string;
  clientName?: string;
}

export default function InquiriesListPage(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const { data: inquiries = [], isLoading } = useGetInquiriesQuery(undefined);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filteredInquiries = React.useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const snap = (inq.packageSnapshot ?? {}) as PackageSnapshotPartial;
      const matchesSearch =
        searchQuery === "" ||
        inq.inquiryNumber.toLowerCase().includes(q) ||
        (inq.client?.name?.toLowerCase().includes(q) ?? false) ||
        (snap.packageName?.toLowerCase().includes(q) ?? false);

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const getStatusBadge = (status: string): React.JSX.Element => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            variant="brand"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="muted"
            className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
          >
            Rejected
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge
            variant="muted"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          >
            Under Review
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge
            variant="muted"
            className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
          >
            Changes Requested
          </Badge>
        );
      default:
        return <Badge variant="muted">Submitted</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-app-fg tracking-tight font-display-lg">
            {user?.role === "CONSULTANT"
              ? "My Package Inquiries"
              : "Package Inquiries & Approvals"}
          </h1>
          <p className="text-xs text-app-muted mt-1">
            {user?.role === "CONSULTANT"
              ? "Track your submitted package customization inquiries."
              : "Review consultant inquiry submissions, update approval status, and manage pricing."}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-app-surface border border-app-border/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-app-muted" />
          <Input
            type="text"
            placeholder="Search by Inquiry ID, Client, or Package..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-app-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            className="h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* List Table / Cards */}
      {isLoading ? (
        <div className="h-64 rounded-3xl bg-app-surface border border-app-border animate-pulse" />
      ) : filteredInquiries.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-8 h-8 text-app-muted mb-2" />
          <h3 className="text-base font-bold text-app-fg">No Inquiries Found</h3>
          <p className="text-xs text-app-muted mt-1">
            There are no inquiries matching your current filter.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-app-surface border border-app-border/80 rounded-3xl shadow-sm">
          <table className="w-full text-left text-xs text-app-fg border-collapse">
            <thead>
              <tr className="border-b border-app-border/60 bg-app-surface-variant/40 text-app-muted uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Inquiry ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Consultant</th>
                <th className="p-4">Package</th>
                <th className="p-4">Travel Date</th>
                <th className="p-4">Calculated Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {filteredInquiries.map((inq) => {
                const total = inq.approvedTotal ?? inq.calculatedTotal;
                const snap = (inq.packageSnapshot ?? {}) as PackageSnapshotPartial;
                const clientFullName = [inq.client?.firstName, inq.client?.lastName]
                  .filter(Boolean)
                  .join(" ");
                const clientDisplayName =
                  inq.client?.name ??
                  (clientFullName !== "" ? clientFullName : null) ??
                  snap.clientName ??
                  "Client Record";

                const consultantFullName = [
                  inq.consultant?.firstName,
                  inq.consultant?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");
                const consultantDisplayName =
                  inq.consultant?.name ??
                  (consultantFullName !== "" ? consultantFullName : null) ??
                  "Consultant";

                return (
                  <tr
                    key={inq.id}
                    className="hover:bg-app-surface-variant/30 transition-colors"
                  >
                    <td className="p-4 font-bold text-app-brand">{inq.inquiryNumber}</td>
                    <td className="p-4 font-semibold">{clientDisplayName}</td>
                    <td className="p-4 text-app-muted">{consultantDisplayName}</td>
                    <td className="p-4 max-w-xs truncate">
                      {snap.packageName ?? inq.package?.packageName}
                    </td>
                    <td className="p-4 text-app-muted">
                      {new Date(inq.travelDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-app-fg">
                      ${total.toLocaleString()}
                    </td>
                    <td className="p-4">{getStatusBadge(inq.status)}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Link
                        href={`/inquiries/${inq.id}`}
                        className="p-2 rounded-xl bg-app-surface-variant hover:bg-app-brand/10 hover:text-app-brand transition-colors text-app-muted"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
