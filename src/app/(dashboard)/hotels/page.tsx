"use client";

import * as React from "react";
import { Building2, BedDouble, AlertCircle, RefreshCw } from "lucide-react";

import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { apiTransformer } from "@/lib/api/api-transformer";
import { HotelTable } from "@/features/hotels/components/hotel-table";
import { RoomTypesModal } from "@/features/hotels/components/room-types-modal";
import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { HotelStatsCards } from "@/features/hotels/components/hotel-stats-cards";
import { RoomTypesManager } from "@/features/hotels/components/room-types-manager";
import { HotelModals } from "@/features/hotels/components/hotel-modals/hotel-modals";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import type { Hotel } from "@/features/hotels/types/hotel.types";

function HotelsHeader({
  totalHotels = 0,
  activeTab,
  setActiveTab,
}: {
  totalHotels?: number | undefined;
  activeTab: "hotels" | "room-types";
  setActiveTab: (tab: "hotels" | "room-types") => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} size="2xl">
            Hotel & Accommodations Management
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            Manage hotel properties, star ratings, room types, pricing, and room
            allocations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
            <Building2 className="w-4 h-4 text-app-brand" />
            <span>{totalHotels} Total Hotels</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-app-border/60 pb-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab("hotels");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "hotels"
              ? "bg-app-brand text-white shadow-md shadow-app-brand/20"
              : "text-app-muted hover:text-app-fg hover:bg-app-surface-variant/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotels Directory</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("room-types");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "room-types"
              ? "bg-app-brand text-white shadow-md shadow-app-brand/20"
              : "text-app-muted hover:text-app-fg hover:bg-app-surface-variant/60"
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Room Types & Pricing</span>
        </button>
      </div>
    </div>
  );
}

export default function HotelsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<"hotels" | "room-types">("hotels");

  const {
    data: hotels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHotelsQuery(undefined);

  const { data: destinations = [] } = useGetDestinationsQuery(undefined);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedHotelForEdit, setSelectedHotelForEdit] = React.useState<Hotel | null>(
    null
  );
  const [selectedHotelForDelete, setSelectedHotelForDelete] =
    React.useState<Hotel | null>(null);
  const [selectedHotelForRoomTypes, setSelectedHotelForRoomTypes] =
    React.useState<Hotel | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <HotelsHeader
        totalHotels={hotels.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "hotels" && (
        <>
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
                <h4 className="text-base font-bold font-display-lg">
                  Failed to load hotels
                </h4>
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
            <HotelTable
              hotels={hotels}
              destinations={destinations}
              onOpenCreate={() => {
                setIsCreateOpen(true);
              }}
              onOpenEdit={(hotel) => {
                setSelectedHotelForEdit(hotel);
              }}
              onOpenDelete={(hotel) => {
                setSelectedHotelForDelete(hotel);
              }}
              onManageRoomTypes={(hotel) => {
                setSelectedHotelForRoomTypes(hotel);
              }}
            />
          )}

          {/* Modals */}
          <HotelModals
            isCreateOpen={isCreateOpen}
            onCloseCreate={() => {
              setIsCreateOpen(false);
            }}
            selectedHotelForEdit={selectedHotelForEdit}
            onCloseEdit={() => {
              setSelectedHotelForEdit(null);
            }}
            selectedHotelForDelete={selectedHotelForDelete}
            onCloseDelete={() => {
              setSelectedHotelForDelete(null);
            }}
          />

          <RoomTypesModal
            hotel={selectedHotelForRoomTypes}
            isOpen={Boolean(selectedHotelForRoomTypes)}
            onClose={() => {
              setSelectedHotelForRoomTypes(null);
            }}
          />
        </>
      )}

      {activeTab === "room-types" && <RoomTypesManager hotels={hotels} />}
    </div>
  );
}
