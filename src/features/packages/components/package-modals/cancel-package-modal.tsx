"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Ban } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useUpdatePackageMutation } from "../../services/packages-api.slice";

import type { Package } from "../../types/package.types";

interface CancelPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
}

export function CancelPackageModal({
  isOpen,
  onClose,
  pkg,
}: CancelPackageModalProps): React.JSX.Element {
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  if (!pkg) return <></>;

  const handleCancelPackage = async (): Promise<void> => {
    try {
      await updatePackage({
        id: pkg.id,
        data: { status: "CANCELLED" },
      }).unwrap();
      toast.success(`Tour Package "${pkg.packageName}" has been cancelled`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to cancel tour package"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Tour Package"
      description="Update package booking status to cancelled"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <span>
            Are you sure you want to cancel package <strong>{pkg.packageName}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">
          Cancelling this package will mark its status as <strong>CANCELLED</strong> in
          the system records. You can view or edit it anytime later.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            isLoading={isLoading}
            onClick={() => {
              void handleCancelPackage();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600 gap-1.5"
          >
            <Ban className="w-4 h-4" />
            Confirm Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
