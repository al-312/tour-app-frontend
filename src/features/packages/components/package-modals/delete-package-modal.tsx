"use client";

import * as React from "react";
import { toast } from "sonner";

import { apiTransformer } from "@/lib/api/api-transformer";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import { useDeletePackageMutation } from "../../services/packages-api.slice";

import type { Package } from "../../types/package.types";

interface DeletePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
}

export function DeletePackageModal({
  isOpen,
  onClose,
  pkg,
}: DeletePackageModalProps): React.JSX.Element {
  const [deletePackage, { isLoading }] = useDeletePackageMutation();

  if (!pkg) return <></>;

  const handleDelete = (): void => {
    deletePackage(pkg.id)
      .unwrap()
      .then(() => {
        toast.success(`Tour Package "${pkg.packageName}" deleted successfully`);
        onClose();
      })
      .catch((err: unknown) => {
        toast.error(apiTransformer.transformError(err, "Failed to delete tour package"));
      });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Tour Package"
      entityName={pkg.packageName}
      description="Deleting this package will remove its day plans and attractions schedules."
      isLoading={isLoading}
      onConfirm={handleDelete}
    />
  );
}
