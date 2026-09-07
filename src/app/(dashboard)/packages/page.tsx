"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PackageCheck, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/store/hooks";
import { apiTransformer } from "@/lib/api/api-transformer";
import { PackageTable } from "@/features/packages/components/package-table";
import { useGetPackagesQuery } from "@/features/packages/services/packages-api.slice";
import { ViewPackageModal } from "@/features/packages/components/package-modals/view-package-modal";
import { CancelPackageModal } from "@/features/packages/components/package-modals/cancel-package-modal";
import { DeletePackageModal } from "@/features/packages/components/package-modals/delete-package-modal";

import type { Package, PackageStatus } from "@/features/packages/types/package.types";

export default function PackagesPage(): React.JSX.Element {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isConsultant = user?.role === "CONSULTANT";

  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const {
    data: rawPackages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPackagesQuery(
    statusFilter !== "ALL" ? (statusFilter as PackageStatus) : undefined
  );

  const packages = React.useMemo(() => {
    if (isConsultant) {
      return rawPackages.filter((p) => p.status !== "EXPIRED");
    }
    return rawPackages;
  }, [rawPackages, isConsultant]);

  const [selectedForView, setSelectedForView] = React.useState<Package | null>(null);
  const [selectedForCancel, setSelectedForCancel] = React.useState<Package | null>(null);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Package | null>(null);

  const confirmedCount = packages.filter((p) => p.status === "CONFIRMED").length;
  const cancelledCount = packages.filter((p) => p.status === "CANCELLED").length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} size="2xl">
            Tour Package Management
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            Curate custom tour packages, link clients, itineraries, and booking statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-app-brand" />
            <span>{packages.length} Total Packages</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Total Packages
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {packages.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-app-brand/10 text-app-brand">
            <PackageCheck className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Confirmed
            </span>
            <div className="text-2xl font-extrabold text-emerald-500 mt-1 font-display-lg">
              {confirmedCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Cancelled
            </span>
            <div className="text-2xl font-extrabold text-rose-500 mt-1 font-display-lg">
              {cancelledCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
          <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
          <span className="text-sm font-semibold text-app-fg">
            Loading tour packages...
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
          <AlertCircle className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">
              Failed to load packages
            </h4>
            <p className="text-xs text-rose-600/80 mt-1 max-w-md">
              {apiTransformer.transformError(
                error,
                "Unable to connect to package service."
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch();
            }}
            className="mt-2 border-rose-500/40 hover:bg-rose-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      ) : (
        <PackageTable
          packages={packages}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onOpenCreate={() => {
            router.push("/packages/create");
          }}
          onOpenEdit={(pkg) => {
            router.push(`/packages/${pkg.id}/edit`);
          }}
          onOpenDelete={(pkg) => {
            setSelectedForDelete(pkg);
          }}
          onOpenView={(pkg) => {
            setSelectedForView(pkg);
          }}
          onCancelPackage={(pkg) => {
            setSelectedForCancel(pkg);
          }}
        />
      )}

      {/* View Modal */}
      <ViewPackageModal
        isOpen={Boolean(selectedForView)}
        onClose={() => {
          setSelectedForView(null);
        }}
        pkg={selectedForView}
      />

      {/* Cancel Modal */}
      <CancelPackageModal
        isOpen={Boolean(selectedForCancel)}
        onClose={() => {
          setSelectedForCancel(null);
        }}
        pkg={selectedForCancel}
      />

      {/* Delete Modal */}
      <DeletePackageModal
        isOpen={Boolean(selectedForDelete)}
        onClose={() => {
          setSelectedForDelete(null);
        }}
        pkg={selectedForDelete}
      />
    </div>
  );
}
