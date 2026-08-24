"use client";

import * as React from "react";

import { EditHotelModal } from "./edit-hotel-modal";
import { CreateHotelModal } from "./create-hotel-modal";
import { DeleteHotelModal } from "./delete-hotel-modal";

import type { Hotel } from "../../types/hotel.types";

interface HotelModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  selectedHotelForEdit: Hotel | null;
  onCloseEdit: () => void;
  selectedHotelForDelete: Hotel | null;
  onCloseDelete: () => void;
}

export function HotelModals({
  isCreateOpen,
  onCloseCreate,
  selectedHotelForEdit,
  onCloseEdit,
  selectedHotelForDelete,
  onCloseDelete,
}: HotelModalsProps): React.JSX.Element {
  return (
    <>
      <CreateHotelModal isOpen={isCreateOpen} onClose={onCloseCreate} />
      <EditHotelModal
        isOpen={Boolean(selectedHotelForEdit)}
        onClose={onCloseEdit}
        hotel={selectedHotelForEdit}
      />
      <DeleteHotelModal
        isOpen={Boolean(selectedHotelForDelete)}
        onClose={onCloseDelete}
        hotel={selectedHotelForDelete}
      />
    </>
  );
}
