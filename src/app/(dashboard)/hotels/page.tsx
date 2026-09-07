"use client";

import Link from "next/link";
import * as React from "react";
import { AlertCircle, Building2, Plus, RefreshCw } from "lucide-react";

import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { apiTransformer } from "@/lib/api/api-transformer";
import { HotelTable } from "@/features/hotels/components/hotel-table";
import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { HotelStatsCards } from "@/features/hotels/components/hotel-stats-cards";
import { DeleteHotelModal } from "@/features/hotels/components/hotel-modals/delete-hotel-modal";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import type { Hotel } from "@/features/hotels/types/hotel.types";

function HotelsHeader({ totalHotels = 0 }: { totalHotels?: number }): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Heading level={1} size="2xl">
          Hotel & Accommodations Management
        </Heading>
        <p className="text-app-muted text-sm font-medium mt-1">
          Manage hotel properties, star ratings, room types, pricing, and allocations.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-3 py-2 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
          <Building2 className="w-4 h-4 text-app-brand" />
          <span>{totalHotels} Total Hotels</span>
        </div>
        <Link href="/hotels/create">
          <Button className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Hotel</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function HotelsPage(): React.JSX.Element {
  const {
    data: hotels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHotelsQuery(undefined);

  const { data: destinations = [] } = useGetDestinationsQuery(undefined);

  const [selectedHotelForDelete, setSelectedHotelForDelete] =
    React.useState<Hotel | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <HotelsHeader totalHotels={hotels.length} />

      {/* Stats Cards */}
      <HotelStatsCards hotels={hotels} />

      {/* Main Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
          <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
          <span className="text-sm font-semibold text-app-fg">Loading hotels...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
          <AlertCircle className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">Failed to load hotels</h4>
            <p className="text-xs text-rose-600/80 mt-1 max-w-md">
              {apiTransformer.transformError(
                error,
                "Unable to connect to hotel service."
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(): void => {
              void refetch();
            }}
            className="mt-2 border-rose-500/40 hover:bg-rose-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      ) : (
        <HotelTable
          hotels={hotels}
          destinations={destinations}
          onOpenDelete={(hotel): void => {
            setSelectedHotelForDelete(hotel);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteHotelModal
        isOpen={Boolean(selectedHotelForDelete)}
        onClose={(): void => {
          setSelectedHotelForDelete(null);
        }}
        hotel={selectedHotelForDelete}
      />
    </div>
  );
}
