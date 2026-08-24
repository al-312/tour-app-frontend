"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useDeleteUserMutation } from "../../services/users-api.slice";

import type { User as UserType } from "../../types/user.types";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  user,
}: DeleteUserModalProps): React.JSX.Element | null {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  if (!user) return null;

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteUser(user.id).unwrap();
      toast.success(`User ${user.name} deleted successfully.`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to delete user"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete User"
      description="This action cannot be undone"
    >
      <div className="flex flex-col gap-5">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>
            Are you sure you want to permanently delete <strong>{user.name}</strong> (
            {user.email})? All associated data and permissions will be removed.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={(): void => {
              void handleDelete();
            }}
          >
            Yes, Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
}
