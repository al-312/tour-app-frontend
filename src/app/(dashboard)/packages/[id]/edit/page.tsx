"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { PackageBuilderPage } from "@/features/packages/components/package-builder-page";

export default function EditPackagePage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const pkgId = params.id;

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center p-16 text-sm font-semibold text-app-muted">
          Loading Package Builder...
        </div>
      }
    >
      <PackageBuilderPage mode="edit" pkgId={pkgId} />
    </React.Suspense>
  );
}
