"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Star, MapPin, BedDouble, X } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import { updateHotelSchema, type UpdateHotelFormData } from "../../schemas/hotel.schema";
import {
  useUpdateHotelMutation,
  useGetRoomTypesQuery,
} from "../../services/hotels-api.slice";

import type { Hotel } from "../../types/hotel.types";

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
}

export function EditHotelModal({
  isOpen,
  onClose,
  hotel,
}: EditHotelModalProps): React.JSX.Element {
  const [updateHotel, { isLoading }] = useUpdateHotelMutation();
  const { data: destinations = [] } = useGetDestinationsQuery(undefined);
  const { data: availableRoomTypes = [] } = useGetRoomTypesQuery(undefined);

  const [selectedRoomTypeIds, setSelectedRoomTypeIds] = React.useState<string[]>([]);
  const [prevHotelId, setPrevHotelId] = React.useState<string | null>(null);

  if (hotel && hotel.id !== prevHotelId) {
    setPrevHotelId(hotel.id);
    setSelectedRoomTypeIds((hotel.roomTypes ?? []).map((rt) => rt.id));
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateHotelFormData>({
    resolver: zodResolver(updateHotelSchema),
  });

  React.useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name,
        destinationId: hotel.destinationId ?? "",
        starRating: String(hotel.starRating),
      });
    }
  }, [hotel, reset]);

  if (!hotel) return <></>;

  const handleAddRoomTypeFromDropdown = (id: string): void => {
    if (!id) return;
    if (!selectedRoomTypeIds.includes(id)) {
      setSelectedRoomTypeIds((prev) => [...prev, id]);
    }
  };

  const handleRemoveRoomType = (id: string): void => {
    setSelectedRoomTypeIds((prev) => prev.filter((item) => item !== id));
  };

  const onSubmit = async (data: UpdateHotelFormData): Promise<void> => {
    try {
      const selectedDestinationId =
        data.destinationId && data.destinationId.trim() !== ""
          ? data.destinationId
          : null;

      await updateHotel({
        id: hotel.id,
        data: {
          name: data.name,
          destinationId: selectedDestinationId,
          starRating: data.starRating !== undefined ? Number(data.starRating) : undefined,
          roomTypeIds: selectedRoomTypeIds,
        },
      }).unwrap();

      toast.success(`Hotel "${hotel.name}" updated successfully!`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update hotel"));
    }
  };

  const destinationOptions = [
    { value: "", label: "Select Destination (Optional)" },
    ...destinations.map((d) => ({
      value: d.id,
      label: `${d.name}, ${d.country}`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Hotel Details"
      description={`Update details for ${hotel.name}`}
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Hotel Name"
          placeholder="e.g. Grand Palace Hotel"
          icon={Building2}
          error={errors.name?.message}
          {...register("name")}
        />

        <Select
          label="Destination"
          icon={MapPin}
          error={errors.destinationId?.message}
          options={destinationOptions}
          {...register("destinationId")}
        />

        <Select
          label="Star Rating"
          icon={Star}
          error={errors.starRating?.message}
          options={[
            { value: "5", label: "5 Stars (Luxury)" },
            { value: "4", label: "4 Stars (Premium)" },
            { value: "3", label: "3 Stars (Standard)" },
            { value: "2", label: "2 Stars (Basic)" },
            { value: "1", label: "1 Star (Budget)" },
          ]}
          {...register("starRating")}
        />

        {/* Room Types Dropdown Selector */}
        <div className="flex flex-col gap-2 pt-2 border-t border-app-border/40">
          <label className="block text-xs font-semibold text-app-fg flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-app-brand" />
            Select Room Types from Dropdown
          </label>

          <select
            defaultValue=""
            onChange={(e) => {
              handleAddRoomTypeFromDropdown(e.target.value);
              e.target.value = "";
            }}
            className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
          >
            <option value="" disabled>
              -- Select Room Type to Add --
            </option>
            {availableRoomTypes.map((rt) => (
              <option
                key={rt.id}
                value={rt.id}
                disabled={selectedRoomTypeIds.includes(rt.id)}
              >
                {rt.name} (${rt.roomPrice}/night - Max {rt.maxAdults} Adults)
              </option>
            ))}
          </select>

          {/* Selected Room Types Pills */}
          <div className="flex flex-wrap gap-2 mt-1 min-h-[36px] p-2.5 rounded-xl border border-app-border/60 bg-app-surface-variant/30 items-center">
            {selectedRoomTypeIds.length === 0 ? (
              <span className="text-xs text-app-muted italic">
                No room types selected yet. Pick from the dropdown above.
              </span>
            ) : (
              selectedRoomTypeIds.map((id) => {
                const rt = availableRoomTypes.find((item) => item.id === id);
                if (!rt) return null;

                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-brand text-white font-semibold text-xs shadow-sm"
                  >
                    <span>
                      {rt.name} (${rt.roomPrice})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveRoomType(id);
                      }}
                      className="hover:bg-white/20 p-0.5 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
