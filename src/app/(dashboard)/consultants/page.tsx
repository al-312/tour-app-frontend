"use client";

import * as React from "react";
import { Briefcase, User } from "lucide-react";

import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { ConsultantTable } from "@/features/consultants/components/consultant-table";
import { PageLoadingState, PageErrorState } from "@/components/shared/page-state-views";
import { useGetConsultantsQuery } from "@/features/consultants/services/consultants-api.slice";
import { ConsultantModals } from "@/features/consultants/components/consultant-modals/consultant-modals";

import type { Consultant } from "@/features/consultants/types/consultant.types";

export default function ConsultantsPage(): React.JSX.Element {
  const {
    data: consultants = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetConsultantsQuery(undefined);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedForEdit, setSelectedForEdit] = React.useState<Consultant | null>(null);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Consultant | null>(
    null
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} size="2xl">
            Consultant Management
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            Manage travel consultants, designations, and branding logos for tour packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-app-brand" />
            <span>{consultants.length} Active Consultants</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Consultants
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {consultants.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-app-brand/10 text-app-brand">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Specializations
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {new Set(consultants.map((c) => c.designation)).size}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <User className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">Status</span>
            <div className="text-sm font-bold text-emerald-500 mt-1 font-display-lg">
              Active Team
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <PageLoadingState label="Loading consultants..." />
      ) : isError ? (
        <PageErrorState
          title="Failed to load consultants"
          error={error}
          defaultMessage="Unable to connect to consultant service."
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <ConsultantTable
          consultants={consultants}
          onOpenCreate={() => {
            setIsCreateOpen(true);
          }}
          onOpenEdit={(consultant) => {
            setSelectedForEdit(consultant);
          }}
          onOpenDelete={(consultant) => {
            setSelectedForDelete(consultant);
          }}
        />
      )}

      {/* Modals */}
      <ConsultantModals
        isCreateOpen={isCreateOpen}
        onCloseCreate={() => {
          setIsCreateOpen(false);
        }}
        selectedForEdit={selectedForEdit}
        onCloseEdit={() => {
          setSelectedForEdit(null);
        }}
        selectedForDelete={selectedForDelete}
        onCloseDelete={() => {
          setSelectedForDelete(null);
        }}
      />
    </div>
  );
}
