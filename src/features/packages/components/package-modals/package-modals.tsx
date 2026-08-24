"use client";

import * as React from "react";

import { EditPackageModal } from "./edit-package-modal";
import { CreatePackageModal } from "./create-package-modal";
import { DeletePackageModal } from "./delete-package-modal";

import type { Package } from "../../types/package.types";

interface PackageModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  selectedForEdit: Package | null;
  onCloseEdit: () => void;
  selectedForDelete: Package | null;
  onCloseDelete: () => void;
}

export function PackageModals({
  isCreateOpen,
  onCloseCreate,
  selectedForEdit,
  onCloseEdit,
  selectedForDelete,
  onCloseDelete,
}: PackageModalsProps): React.JSX.Element {
  return (
    <>
      <CreatePackageModal isOpen={isCreateOpen} onClose={onCloseCreate} />
      <EditPackageModal
        isOpen={Boolean(selectedForEdit)}
        onClose={onCloseEdit}
        pkg={selectedForEdit}
      />
      <DeletePackageModal
        isOpen={Boolean(selectedForDelete)}
        onClose={onCloseDelete}
        pkg={selectedForDelete}
      />
    </>
  );
}
