"use client";

import * as React from "react";
import { toast } from "sonner";

import { apiTransformer } from "@/lib/api/api-transformer";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { useDeleteDestinationMutation } from "../../services/destinations-api.slice";

import type { Destination } from "../../types/destination.types";

interface DeleteDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
}

export function DeleteDestinationModal({
  isOpen,
  onClose,
  destination,
}: DeleteDestinationModalProps): React.JSX.Element {
  const [deleteDestination, { isLoading }] = useDeleteDestinationMutation();

  if (!destination) return <></>;

  const handleDelete = (): void => {
    deleteDestination(destination.id)
      .unwrap()
      .then(() => {
        toast.success(`Location "${destination.name}" deleted successfully`);
        onClose();
      })
      .catch((err: unknown) => {
        toast.error(apiTransformer.transformError(err, "Failed to delete location"));
      });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Location"
      entityName={destination.name}
      description="Deleting this location will disassociate linked hotels and package plans."
      isLoading={isLoading}
      onConfirm={handleDelete}
    />
  );
}
