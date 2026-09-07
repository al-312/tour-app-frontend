"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import Modal from "./modal";
import Button from "./button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  title,
  entityName,
  description,
  isLoading,
  onConfirm,
}: DeleteConfirmModalProps): React.JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong>{entityName}</strong>?
          </span>
        </div>

        <p className="text-xs text-app-muted">{description}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
