"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

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

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteClient(client.id).unwrap();
      toast.success(`Client "${client.name}" deleted successfully`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete client"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Client"
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{client.name}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Deleting this client will remove their profile record from the system.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={() => {
              void handleDelete();
            }}
          >
            Delete Client
          </Button>
        </div>
      </div>
    </Modal>
  );
}
