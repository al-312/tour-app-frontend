"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

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

  const handleDelete = async (): Promise<void> => {
    try {
      await deletePackage(pkg.id).unwrap();
      toast.success(`Tour Package "${pkg.packageName}" deleted successfully`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete tour package"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Tour Package"
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{pkg.packageName}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Deleting this package will remove its day plans and attractions schedules.
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
            Delete Package
          </Button>
        </div>
      </div>
    </Modal>
  );
}
