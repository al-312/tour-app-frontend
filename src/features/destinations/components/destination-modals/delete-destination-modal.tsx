"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

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

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteDestination(destination.id).unwrap();
      toast.success(`Destination "${destination.name}" deleted successfully`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete destination"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Destination"
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{destination.name}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Deleting this destination will disassociate linked hotels, attractions, and
          package day plans.
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
            Delete Destination
          </Button>
        </div>
      </div>
    </Modal>
  );
}
