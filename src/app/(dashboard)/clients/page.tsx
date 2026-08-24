"use client";

import * as React from "react";
import { UserCheck, Globe, FileText, RefreshCw, AlertCircle } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { apiTransformer } from "@/lib/api/api-transformer";
import { ClientTable } from "@/features/clients/components/client-table";
import { useGetClientsQuery } from "@/features/clients/services/clients-api.slice";
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
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
          <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
          <span className="text-sm font-semibold text-app-fg">Loading clients...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
          <AlertCircle className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">
              Failed to load clients
            </h4>
            <p className="text-xs text-rose-600/80 mt-1 max-w-md">
              {apiTransformer.transformError(
                error,
                "Unable to connect to client service."
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
