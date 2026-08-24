"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { PackageBuilderPage } from "@/features/packages/components/package-builder-page";

export default function EditPackagePage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const pkgId = params.id;

  return <PackageBuilderPage mode="edit" pkgId={pkgId} />;
}
