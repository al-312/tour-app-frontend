"use client";

import * as React from "react";
import { UserCheck, Globe, FileText } from "lucide-react";

import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { ClientTable } from "@/features/clients/components/client-table";
import { useGetClientsQuery } from "@/features/clients/services/clients-api.slice";
import { PageLoadingState, PageErrorState } from "@/components/shared/page-state-views";
import { ClientModals } from "@/features/clients/components/client-modals/client-modals";

import type { Client } from "@/features/clients/types/client.types";

export default function ClientsPage(): React.JSX.Element {
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery(undefined);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedForEdit, setSelectedForEdit] = React.useState<Client | null>(null);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Client | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} size="2xl">
            Client Management
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            Manage client profiles, contact information, nationalities, and notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-app-brand" />
            <span>{clients.length} Registered Clients</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Total Clients
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {clients.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-app-brand/10 text-app-brand">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              International
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {new Set(clients.map((c) => c.nationality).filter(Boolean)).size}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Globe className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Active Records
            </span>
            <div className="text-sm font-bold text-emerald-500 mt-1 font-display-lg">
              Verified Profiles
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <FileText className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <PageLoadingState label="Loading clients..." />
      ) : isError ? (
        <PageErrorState
          title="Failed to load clients"
          error={error}
          defaultMessage="Unable to connect to client service."
          onRetry={() => {
            void refetch();
          }}
        />
      ) : (
        <ClientTable
          clients={clients}
          onOpenCreate={() => {
            setIsCreateOpen(true);
          }}
          onOpenEdit={(client) => {
            setSelectedForEdit(client);
          }}
          onOpenDelete={(client) => {
            setSelectedForDelete(client);
          }}
        />
      )}

      {/* Modals */}
      <ClientModals
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
