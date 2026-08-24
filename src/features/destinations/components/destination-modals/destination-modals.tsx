"use client";

import * as React from "react";

import { EditDestinationModal } from "./edit-destination-modal";
import { CreateDestinationModal } from "./create-destination-modal";
import { DeleteDestinationModal } from "./delete-destination-modal";

import type { Destination } from "../../types/destination.types";

interface DestinationModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  selectedForEdit: Destination | null;
  onCloseEdit: () => void;
  selectedForDelete: Destination | null;
  onCloseDelete: () => void;
}

export function DestinationModals({
  isCreateOpen,
  onCloseCreate,
  selectedForEdit,
  onCloseEdit,
  selectedForDelete,
  onCloseDelete,
}: DestinationModalsProps): React.JSX.Element {
  return (
    <>
      <CreateDestinationModal isOpen={isCreateOpen} onClose={onCloseCreate} />
      <EditDestinationModal
        isOpen={Boolean(selectedForEdit)}
        onClose={onCloseEdit}
        destination={selectedForEdit}
      />
      <DeleteDestinationModal
        isOpen={Boolean(selectedForDelete)}
        onClose={onCloseDelete}
        destination={selectedForDelete}
      />
    </>
  );
}
