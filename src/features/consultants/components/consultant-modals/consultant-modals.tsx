"use client";

import * as React from "react";

import { EditConsultantModal } from "./edit-consultant-modal";
import { CreateConsultantModal } from "./create-consultant-modal";
import { DeleteConsultantModal } from "./delete-consultant-modal";

import type { Consultant } from "../../types/consultant.types";

interface ConsultantModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  selectedForEdit: Consultant | null;
  onCloseEdit: () => void;
  selectedForDelete: Consultant | null;
  onCloseDelete: () => void;
}

export function ConsultantModals({
  isCreateOpen,
  onCloseCreate,
  selectedForEdit,
  onCloseEdit,
  selectedForDelete,
  onCloseDelete,
}: ConsultantModalsProps): React.JSX.Element {
  return (
    <>
      <CreateConsultantModal isOpen={isCreateOpen} onClose={onCloseCreate} />
      <EditConsultantModal
        isOpen={Boolean(selectedForEdit)}
        onClose={onCloseEdit}
        consultant={selectedForEdit}
      />
      <DeleteConsultantModal
        isOpen={Boolean(selectedForDelete)}
        onClose={onCloseDelete}
        consultant={selectedForDelete}
      />
    </>
  );
}
