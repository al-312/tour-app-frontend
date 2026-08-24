"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useDeleteConsultantMutation } from "../../services/consultants-api.slice";

import type { Consultant } from "../../types/consultant.types";

interface DeleteConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant | null;
}

export function DeleteConsultantModal({
  isOpen,
  onClose,
  consultant,
}: DeleteConsultantModalProps): React.JSX.Element {
  const [deleteConsultant, { isLoading }] = useDeleteConsultantMutation();

  if (!consultant) return <></>;

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteConsultant(consultant.id).unwrap();
      toast.success(`Consultant "${consultant.name}" deleted successfully`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete consultant"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Consultant"
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{consultant.name}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Deleting this consultant will unassign them from tour packages.
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
            Delete Consultant
          </Button>
        </div>
      </div>
    </Modal>
  );
}
