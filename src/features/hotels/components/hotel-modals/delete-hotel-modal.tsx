"use client";

import * as React from "react";
import { toast } from "sonner";

import { apiTransformer } from "@/lib/api/api-transformer";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { useDeleteHotelMutation } from "../../services/hotels-api.slice";

import type { Hotel } from "../../types/hotel.types";

interface DeleteHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
}

export function DeleteHotelModal({
  isOpen,
  onClose,
  hotel,
}: DeleteHotelModalProps): React.JSX.Element {
  const [deleteHotel, { isLoading }] = useDeleteHotelMutation();

  if (!hotel) return <></>;

  const handleDelete = (): void => {
    deleteHotel(hotel.id)
      .unwrap()
      .then(() => {
        toast.success(`Hotel "${hotel.name}" deleted successfully`);
        onClose();
      })
      .catch((err: unknown) => {
        toast.error(apiTransformer.transformError(err, "Failed to delete hotel"));
      });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Hotel"
      entityName={hotel.name}
      description="Removing this hotel will remove it from default destination options and tour package recommendations."
      isLoading={isLoading}
      onConfirm={handleDelete}
    />
  );
}
