"use client";

import * as React from "react";
import { MapPin, Globe, RefreshCw, AlertCircle, Building2 } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { apiTransformer } from "@/lib/api/api-transformer";
import { DestinationTable } from "@/features/destinations/components/destination-table";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";
import { DestinationModals } from "@/features/destinations/components/destination-modals/destination-modals";

import type { Destination } from "@/features/destinations/types/destination.types";

export default function DestinationsPage(): React.JSX.Element {
  const {
    data: destinations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDestinationsQuery(undefined);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedForEdit, setSelectedForEdit] = React.useState<Destination | null>(null);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Destination | null>(
    null
  );

  const uniqueCountries = new Set(destinations.map((d) => d.country)).size;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} size="2xl">
            Destination Management
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            Manage travel destinations, countries, and cover imagery for packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-app-brand" />
            <span>{destinations.length} Total Destinations</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Destinations
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {destinations.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-app-brand/10 text-app-brand">
            <MapPin className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">
              Countries
            </span>
            <div className="text-2xl font-extrabold text-app-fg mt-1 font-display-lg">
              {uniqueCountries}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Globe className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-app-muted uppercase">Status</span>
            <div className="text-sm font-bold text-emerald-500 mt-1 font-display-lg">
              Active Database
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Building2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
          <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
          <span className="text-sm font-semibold text-app-fg">
            Loading destinations...
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
          <AlertCircle className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">
              Failed to load destinations
            </h4>
            <p className="text-xs text-rose-600/80 mt-1 max-w-md">
              {apiTransformer.transformError(
                error,
                "Unable to connect to destination service."
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
        <DestinationTable
          destinations={destinations}
          onOpenCreate={() => {
            setIsCreateOpen(true);
          }}
          onOpenEdit={(dest) => {
            setSelectedForEdit(dest);
          }}
          onOpenDelete={(dest) => {
            setSelectedForDelete(dest);
          }}
        />
      )}

      {/* Modals */}
      <DestinationModals
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
