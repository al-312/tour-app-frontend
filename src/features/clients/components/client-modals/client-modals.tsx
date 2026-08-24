"use client";

import * as React from "react";

import { EditClientModal } from "./edit-client-modal";
import { CreateClientModal } from "./create-client-modal";
import { DeleteClientModal } from "./delete-client-modal";

import type { Client } from "../../types/client.types";

interface ClientModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  selectedForEdit: Client | null;
  onCloseEdit: () => void;
  selectedForDelete: Client | null;
  onCloseDelete: () => void;
}

export function ClientModals({
  isCreateOpen,
  onCloseCreate,
  selectedForEdit,
  onCloseEdit,
  selectedForDelete,
  onCloseDelete,
}: ClientModalsProps): React.JSX.Element {
  return (
    <>
      <CreateClientModal isOpen={isCreateOpen} onClose={onCloseCreate} />
      <EditClientModal
        isOpen={Boolean(selectedForEdit)}
        onClose={onCloseEdit}
        client={selectedForEdit}
      />
      <DeleteClientModal
        isOpen={Boolean(selectedForDelete)}
        onClose={onCloseDelete}
        client={selectedForDelete}
      />
    </>
  );
}
