"use client";

import * as React from "react";
import { toast } from "sonner";

import { apiTransformer } from "@/lib/api/api-transformer";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

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

  const consultantDisplayName =
    (consultant.name ??
      [consultant.firstName, consultant.lastName].filter(Boolean).join(" ")) ||
    "Consultant";

  const handleDelete = (): void => {
    deleteConsultant(consultant.id)
      .unwrap()
      .then(() => {
        toast.success(`Consultant "${consultantDisplayName}" deleted successfully`);
        onClose();
      })
      .catch((err: unknown) => {
        toast.error(apiTransformer.transformError(err, "Failed to delete consultant"));
      });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Consultant"
      entityName={consultantDisplayName}
      description="Deleting this consultant will unassign them from tour packages."
      isLoading={isLoading}
      onConfirm={handleDelete}
    />
  );
}
