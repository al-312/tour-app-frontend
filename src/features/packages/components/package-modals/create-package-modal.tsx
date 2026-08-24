"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePackageModal({
  isOpen,
  onClose,
}: CreatePackageModalProps): React.JSX.Element | null {
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen) {
      onClose();
      router.push("/packages/create");
    }
  }, [isOpen, onClose, router]);

  return null;
}
