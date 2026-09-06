"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, CheckCircle2, BedDouble } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import {
  useGetRoomTypesQuery,
  useUpdateHotelMutation,
  useCreateIndependentRoomTypeMutation,
} from "../services/hotels-api.slice";

import type { Hotel } from "../types/hotel.types";

interface RoomTypesModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomTypesModal({
  hotel,
  isOpen,
  onClose,
}: RoomTypesModalProps): React.JSX.Element {
  const { data: masterRoomTypes = [] } = useGetRoomTypesQuery(undefined);
  const [updateHotel] = useUpdateHotelMutation();
  const [createIndependentRoomType, { isLoading: isCreating }] =
    useCreateIndependentRoomTypeMutation();

  const [name, setName] = React.useState("Deluxe Room");
  const [roomPrice, setRoomPrice] = React.useState(150);
  const [maxAdults, setMaxAdults] = React.useState(2);
  const [maxChildren, setMaxChildren] = React.useState(1);
  const [extraBedAvailable, setExtraBedAvailable] = React.useState(true);
  const [extraBedPrice, setExtraBedPrice] = React.useState(40);
  const [maxExtraBeds, setMaxExtraBeds] = React.useState(1);

  if (!hotel) return <></>;

  const assignedRoomTypeIds = (hotel.roomTypes ?? []).map((rt) => rt.id);

  const handleToggleRoomTypeAssociation = async (roomTypeId: string): Promise<void> => {
    const isCurrentlyAssigned = assignedRoomTypeIds.includes(roomTypeId);
    const updatedIds = isCurrentlyAssigned
      ? assignedRoomTypeIds.filter((id) => id !== roomTypeId)
      : [...assignedRoomTypeIds, roomTypeId];

    try {
      await updateHotel({
        id: hotel.id,
        data: {
          roomTypeIds: updatedIds,
        },
      }).unwrap();
      toast.success("Hotel room types updated");
    } catch {
      toast.error("Failed to update hotel room types");
    }
  };

  const handleAddRoomType = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {
      await createIndependentRoomType({
        name,
        roomPrice,
        maxAdults,
        maxChildren,
        extraBedAvailable,
        extraBedPrice,
        maxExtraBeds,
        hotelId: hotel.id,
      }).unwrap();

      toast.success(`Master Room Type "${name}" created and assigned to ${hotel.name}!`);
      setName("");
      setRoomPrice(150);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } } | undefined;
      toast.error(errorObj?.data?.message ?? "Failed to add room type");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Master Room Types - ${hotel.name}`}
      description="Select from independent room types catalog or add new room types"
    >
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        {/* Master Catalog Selection */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-app-fg uppercase tracking-wider flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-app-brand" />
            Master Catalog Room Types ({masterRoomTypes.length})
          </h4>

          {masterRoomTypes.length === 0 ? (
            <div className="p-4 rounded-xl border border-app-border/60 text-xs text-app-muted text-center italic">
              No master room types in catalog. Create one using the form below.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
              {masterRoomTypes.map((rt) => {
                const isAssigned = assignedRoomTypeIds.includes(rt.id);

                return (
                  <div
                    key={rt.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isAssigned
                        ? "border-app-brand/60 bg-app-brand/5"
                        : "border-app-border/60 bg-app-surface hover:border-app-border"
                    }`}
                    onClick={(): void => {
                      void handleToggleRoomTypeAssociation(rt.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={(): void => {
                          /* Controlled input handled by parent div onClick */
                        }}
                        className="w-4 h-4 rounded text-app-brand focus:ring-app-brand"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-app-fg">{rt.name}</span>
                        <span className="text-app-muted text-[11px]">
                          Max Adults: {rt.maxAdults} | Base Price: ${rt.roomPrice}/night
                        </span>
                      </div>
                    </div>

                    {isAssigned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-app-brand">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add New Room Type Form */}
        <form
          onSubmit={(e): void => {
            void handleAddRoomType(e);
          }}
          className="border-t border-app-border/40 pt-4 flex flex-col gap-4"
        >
          <h4 className="text-xs font-bold text-app-fg uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-app-brand" /> Create New Master Room Type for{" "}
            {hotel.name}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-app-fg mb-1">
                Room Type Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. Deluxe Suite"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-fg mb-1">
                Base Room Price ($/night) *
              </label>
              <Input
                type="number"
                min={0}
                value={roomPrice}
                onChange={(e) => {
                  setRoomPrice(parseFloat(e.target.value) || 0);
                }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-fg mb-1">
                Max Adults *
              </label>
              <Input
                type="number"
                min={1}
                value={maxAdults}
                onChange={(e) => {
                  setMaxAdults(parseInt(e.target.value, 10) || 1);
                }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-fg mb-1">
                Max Children
              </label>
              <Input
                type="number"
                min={0}
                value={maxChildren}
                onChange={(e) => {
                  setMaxChildren(parseInt(e.target.value, 10) || 0);
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-app-surface-variant/40 border border-app-border/60 flex flex-col gap-3 text-xs">
            <label className="flex items-center gap-2 font-semibold text-app-fg cursor-pointer">
              <input
                type="checkbox"
                checked={extraBedAvailable}
                onChange={(e) => {
                  setExtraBedAvailable(e.target.checked);
                }}
                className="w-4 h-4 rounded text-app-brand focus:ring-app-brand"
              />
              <span>Extra Bed Available</span>
            </label>

            {extraBedAvailable && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-app-muted mb-1">
                    Extra Bed Price ($/night)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={extraBedPrice}
                    onChange={(e) => {
                      setExtraBedPrice(parseFloat(e.target.value) || 0);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-app-muted mb-1">
                    Max Extra Beds
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={maxExtraBeds}
                    onChange={(e) => {
                      setMaxExtraBeds(parseInt(e.target.value, 10) || 1);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Done
            </Button>
            <Button type="submit" disabled={isCreating || !name}>
              {isCreating ? "Adding..." : "Add & Assign Room Type"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
