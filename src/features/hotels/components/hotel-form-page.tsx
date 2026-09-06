"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Building2, MapPin, RefreshCw, Star } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Heading from "@/components/ui/heading";
import { apiTransformer } from "@/lib/api/api-transformer";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import { RoomTypeFormSection } from "./room-type-form-section";
import { createHotelSchema, type CreateHotelFormData } from "../schemas/hotel.schema";
import {
  useCreateHotelMutation,
  useGetHotelByIdQuery,
  useUpdateHotelMutation,
} from "../services/hotels-api.slice";

import type { CreateRoomTypeRequest } from "../types/hotel.types";

interface HotelFormPageProps {
  mode: "create" | "edit";
  hotelId?: string;
}

export function HotelFormPage({ mode, hotelId }: HotelFormPageProps): React.JSX.Element {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const {
    data: hotel,
    isLoading: isLoadingHotel,
    isError: isHotelError,
    error: hotelError,
  } = useGetHotelByIdQuery(hotelId ?? "", {
    skip: !isEditMode || !hotelId,
  });

  const { data: destinations = [] } = useGetDestinationsQuery(undefined);

  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const [hotelRoomTypes, setHotelRoomTypes] = React.useState<CreateRoomTypeRequest[]>([]);
  const [prevHotelId, setPrevHotelId] = React.useState<string | null>(null);

  if (isEditMode && hotel && hotel.id !== prevHotelId) {
    setPrevHotelId(hotel.id);
    const existing = (hotel.roomTypes ?? []).map((rt) => ({
      name: rt.name,
      roomPrice: rt.roomPrice,
      extraBedPrice: rt.extraBedPrice,
      maxAdults: rt.maxAdults,
      maxChildren: rt.maxChildren,
      extraBedAvailable: rt.extraBedAvailable,
      maxExtraBeds: rt.maxExtraBeds,
    }));
    setHotelRoomTypes(existing);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateHotelFormData>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: "",
      destinationId: "",
      starRating: "3",
    },
  });

  React.useEffect(() => {
    if (isEditMode && hotel) {
      reset({
        name: hotel.name,
        destinationId: hotel.destinationId ?? "",
        starRating: String(hotel.starRating),
      });
    }
  }, [isEditMode, hotel, reset]);

  const handleAddRoomType = (room: CreateRoomTypeRequest): void => {
    setHotelRoomTypes((prev) => [...prev, room]);
  };

  const handleRemoveRoomType = (index: number): void => {
    setHotelRoomTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateHotelFormData): Promise<void> => {
    try {
      const selectedDestinationId =
        data.destinationId && data.destinationId.trim() !== ""
          ? data.destinationId
          : undefined;

      if (isEditMode && hotelId) {
        await updateHotel({
          id: hotelId,
          data: {
            name: data.name,
            destinationId: selectedDestinationId ?? null,
            starRating: Number(data.starRating),
            roomTypes: hotelRoomTypes,
          },
        }).unwrap();
        toast.success(`Hotel "${data.name}" updated successfully!`);
      } else {
        await createHotel({
          name: data.name,
          destinationId: selectedDestinationId,
          starRating: Number(data.starRating),
          roomTypes: hotelRoomTypes.length > 0 ? hotelRoomTypes : undefined,
        }).unwrap();
        toast.success(`Hotel "${data.name}" created successfully!`);
      }

      router.push("/hotels");
    } catch (err) {
      toast.error(
        apiTransformer.transformError(
          err,
          isEditMode ? "Failed to update hotel" : "Failed to create hotel"
        )
      );
    }
  };

  const destinationOptions = React.useMemo(() => {
    const opts = destinations.map((d) => ({
      value: d.id,
      label: `${d.name}, ${d.country}`,
    }));
    return [{ value: "", label: "Select Destination (Optional)" }, ...opts];
  }, [destinations]);

  if (isEditMode && isLoadingHotel) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
        <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
        <span className="text-sm font-semibold text-app-fg">
          Loading hotel details...
        </span>
      </div>
    );
  }

  if (isEditMode && isHotelError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
        <AlertCircle className="w-8 h-8 shrink-0" />
        <div>
          <h4 className="text-base font-bold font-display-lg">Failed to load hotel</h4>
          <p className="text-xs text-rose-600/80 mt-1 max-w-md">
            {apiTransformer.transformError(
              hotelError,
              "Unable to find the requested hotel."
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => {
            router.push("/hotels");
          }}
          className="mt-2 border-rose-500/40 hover:bg-rose-500/20"
        >
          Return to Hotels
        </Button>
      </div>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={(): void => {
            router.push("/hotels");
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-app-muted hover:text-app-fg transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hotels Directory</span>
        </button>

        <div>
          <Heading level={1} size="2xl">
            {isEditMode ? `Edit Hotel — ${hotel?.name ?? ""}` : "Create New Hotel"}
          </Heading>
          <p className="text-app-muted text-sm font-medium mt-1">
            {isEditMode
              ? "Update property details and configure individual room types with prices."
              : "Add a new hotel property and configure its individual room types with prices."}
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="p-6 border-app-border/80 flex flex-col gap-6 shadow-sm">
        <form
          onSubmit={(e): void => {
            void handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col gap-6"
        >
          {/* Section 1: Basic Property Information */}
          <div className="flex flex-col gap-4 border-b border-app-border/40 pb-6">
            <h3 className="text-sm font-bold text-app-fg uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-app-brand" />
              Property Details
            </h3>

            <Input
              label="Hotel Name"
              placeholder="e.g. Grand Hyatt Paris"
              icon={Building2}
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Section 2: Individual Hotel Room Types & Pricing */}
          <RoomTypeFormSection
            roomTypes={hotelRoomTypes}
            onAddRoomType={handleAddRoomType}
            onRemoveRoomType={handleRemoveRoomType}
          />

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-app-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={(): void => {
                router.push("/hotels");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? "Save Changes" : "Create Hotel"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
