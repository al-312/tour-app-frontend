"use client";

import Link from "next/link";
import * as React from "react";
import { Building2, Plus } from "lucide-react";

import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { HotelTable } from "@/features/hotels/components/hotel-table";
import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { HotelStatsCards } from "@/features/hotels/components/hotel-stats-cards";
import { PageLoadingState, PageErrorState } from "@/components/shared/page-state-views";
import { DeleteHotelModal } from "@/features/hotels/components/hotel-modals/delete-hotel-modal";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import type { Hotel } from "@/features/hotels/types/hotel.types";

function HotelsHeader({ totalHotels = 0 }: { totalHotels?: number }): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Heading level={1} size="2xl">
          Hotel &amp; Accommodations Management
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
        <PageLoadingState label="Loading hotels..." />
      ) : isError ? (
        <PageErrorState
          title="Failed to load hotels"
          error={error}
          defaultMessage="Unable to connect to hotel service."
          onRetry={(): void => {
            void refetch();
          }}
        />
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
