"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Star, MapPin } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import { useUpdateHotelMutation } from "../../services/hotels-api.slice";
import { updateHotelSchema, type UpdateHotelFormData } from "../../schemas/hotel.schema";

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
