"use client";

import * as React from "react";

import { PackageBuilderPage } from "@/features/packages/components/package-builder-page";

export default function CreatePackagePage(): React.JSX.Element {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center p-16 text-sm font-semibold text-app-muted">
          Loading Package Builder...
        </div>
      }
    >
      <PackageBuilderPage mode="create" />
    </React.Suspense>
  );
}
