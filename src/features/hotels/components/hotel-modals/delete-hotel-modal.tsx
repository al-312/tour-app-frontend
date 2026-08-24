"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

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

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteHotel(hotel.id).unwrap();
      toast.success(`Hotel "${hotel.name}" deleted successfully`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete hotel"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Hotel"
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{hotel.name}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Removing this hotel will remove it from default destination options and tour
          package recommendations.
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
            Delete Hotel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
