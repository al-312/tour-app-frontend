"use client";

import * as React from "react";

import { PackageBuilderPage } from "@/features/packages/components/package-builder-page";

export default function CreatePackagePage(): React.JSX.Element {
  return <PackageBuilderPage mode="create" />;
}
