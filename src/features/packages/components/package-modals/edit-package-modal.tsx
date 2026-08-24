"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { Package } from "../../types/package.types";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package | null;
}

export function EditPackageModal({
  isOpen,
  onClose,
  pkg,
}: EditPackageModalProps): React.JSX.Element | null {
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen && pkg) {
      onClose();
      router.push(`/packages/${pkg.id}/edit`);
    }
  }, [isOpen, onClose, pkg, router]);

  return null;
}
