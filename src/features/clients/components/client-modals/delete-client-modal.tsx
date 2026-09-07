"use client";

import * as React from "react";
import { toast } from "sonner";

import { apiTransformer } from "@/lib/api/api-transformer";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { useDeleteClientMutation } from "../../services/clients-api.slice";

import type { Client } from "../../types/client.types";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function DeleteClientModal({
  isOpen,
  onClose,
  client,
}: DeleteClientModalProps): React.JSX.Element {
  const [deleteClient, { isLoading }] = useDeleteClientMutation();

  if (!client) return <></>;

  const handleDelete = (): void => {
    deleteClient(client.id)
      .unwrap()
      .then(() => {
        toast.success(`Client "${client.name}" deleted successfully`);
        onClose();
      })
      .catch((err: unknown) => {
        toast.error(apiTransformer.transformError(err, "Failed to delete client"));
      });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Client"
      entityName={client.name}
      description="Deleting this client will remove their profile record from the system."
      isLoading={isLoading}
      onConfirm={handleDelete}
    />
  );
}
