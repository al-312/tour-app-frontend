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

import { useCreateHotelMutation } from "../../services/hotels-api.slice";
import { createHotelSchema, type CreateHotelFormData } from "../../schemas/hotel.schema";

interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHotelModal({
  isOpen,
  onClose,
}: CreateHotelModalProps): React.JSX.Element {
  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const { data: destinations = [] } = useGetDestinationsQuery(undefined);

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

  const onSubmit = async (data: CreateHotelFormData): Promise<void> => {
    try {
      const selectedDestinationId =
        data.destinationId && data.destinationId.trim() !== ""
          ? data.destinationId
          : undefined;

      await createHotel({
        name: data.name,
        destinationId: selectedDestinationId,
        starRating: Number(data.starRating),
      }).unwrap();

      toast.success(`Hotel "${data.name}" created successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create hotel"));
    }
  };

  const destinationOptions = React.useMemo(() => {
    const opts = destinations.map((d) => ({
      value: d.id,
      label: `${d.name}, ${d.country}`,
    }));
    return [{ value: "", label: "Select Destination (Optional)" }, ...opts];
  }, [destinations]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Hotel"
      description="Add accommodation details to the MVP database"
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
            Create Hotel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
