"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Globe, Image as ImageIcon } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useCreateDestinationMutation } from "../../services/destinations-api.slice";
import {
  destinationSchema,
  type DestinationFormData,
} from "../../schemas/destination.schema";

interface CreateDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDestinationModal({
  isOpen,
  onClose,
}: CreateDestinationModalProps): React.JSX.Element {
  const [createDestination, { isLoading }] = useCreateDestinationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: { name: "", country: "", description: "", coverImage: "" },
  });

  const onSubmit = async (data: DestinationFormData): Promise<void> => {
    try {
      await createDestination({
        name: data.name,
        country: data.country,
        description: data.description ?? undefined,
        coverImage: data.coverImage ?? undefined,
      }).unwrap();

      toast.success(`Destination "${data.name}" created successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create destination"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Destination"
      description="Add a new city / destination to the database"
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Destination Name"
          placeholder="e.g. Paris"
          icon={MapPin}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Country"
          placeholder="e.g. France"
          icon={Globe}
          error={errors.country?.message}
          {...register("country")}
        />
        <Input
          label="Description"
          placeholder="e.g. City of lights..."
          error={errors.description?.message}
          {...register("description")}
        />
        <Input
          label="Cover Image URL"
          placeholder="https://images.unsplash.com/..."
          icon={ImageIcon}
          error={errors.coverImage?.message}
          {...register("coverImage")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Destination
          </Button>
        </div>
      </form>
    </Modal>
  );
}
