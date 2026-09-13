"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Calendar, Users, Clock, Compass } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useSearchPackagesQuery } from "@/features/packages/services/packages-api.slice";
import {
  searchPackageSchema,
  type SearchPackageFormData,
} from "@/features/packages/schemas/package.schema";

import { PackageSearchResultCard } from "./package-search-result-card";

export default function ConsultantPackageSearchPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = React.useState<{
    travelDate?: string;
    days?: number;
    adults?: number;
    children?: number;
  }>({});

  const {
    data: rawPackages = [],
    isLoading,
    isFetching,
  } = useSearchPackagesQuery(searchParams);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SearchPackageFormData>({
    resolver: zodResolver(searchPackageSchema),
    defaultValues: {
      travelDate: "2026-10-15",
      days: 5,
      adults: 2,
      children: 0,
    },
  });

  const packages = React.useMemo(() => {
    return rawPackages.filter((p) => p.status !== "EXPIRED");
  }, [rawPackages]);

  const onSearchSubmit = (data: SearchPackageFormData): void => {
    const params: {
      travelDate?: string;
      days?: number;
      adults?: number;
      children?: number;
    } = {};

    if (data.travelDate) params.travelDate = data.travelDate;
    if (data.days) params.days = data.days;
    if (data.adults) params.adults = data.adults;
    if (data.children !== undefined) params.children = data.children;

    setSearchParams(params);
  };

  const handleOpenCustomizeInNewTab = (pkgId: string): void => {
    const formValues = watch();
    const query = new URLSearchParams({
      travelDate: formValues.travelDate ?? "2026-10-15",
      days: String(formValues.days ?? 5),
      adults: String(formValues.adults ?? 2),
      children: String(formValues.children ?? 0),
    });
    window.open(`/packages/${pkgId}/customize?${query.toString()}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-app-brand/10 via-brand-500/5 to-transparent border border-app-brand/20 rounded-3xl p-6 lg:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-app-brand/10 text-app-brand text-xs font-semibold mb-3">
            <Compass className="w-4 h-4" />
            <span>Consultant Package Workflow</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-app-fg tracking-tight font-display-lg">
            Search Tour Packages
          </h1>
          <p className="text-sm text-app-muted mt-2">
            Select travel criteria below to search available curated travel packages for
            your clients. Selecting a package opens customization in a new browser tab.
          </p>
        </div>

        {/* Search Criteria Form using React Hook Form */}
        <form
          onSubmit={(e): void => {
            void handleSubmit(onSearchSubmit)(e);
          }}
          className="mt-6 bg-app-surface/90 border border-app-border/80 rounded-2xl p-5 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-app-muted" />
              Travel Date
            </label>
            <Input
              type="date"
              className="h-10 text-xs"
              error={errors.travelDate?.message}
              {...register("travelDate")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-app-muted" />
              Days
            </label>
            <Input
              type="number"
              min={1}
              className="h-10 text-xs"
              error={errors.days?.message}
              {...register("days", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-app-muted" />
              Adults / Children
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                title="Adults"
                placeholder="Adults"
                className="h-10 text-xs"
                error={errors.adults?.message}
                {...register("adults", { valueAsNumber: true })}
              />
              <Input
                type="number"
                min={0}
                title="Children"
                placeholder="Children"
                className="h-10 text-xs"
                error={errors.children?.message}
                {...register("children", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full gap-2 h-10"
              disabled={isLoading || isFetching}
            >
              <Search className="w-4 h-4" />
              <span>{isFetching ? "Searching..." : "Search Packages"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Package Search Results */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-app-fg font-display-md">
            Available Packages ({packages.length})
          </h2>
          <span className="text-xs text-app-muted">
            Select a package to customize hotel options for your client
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-app-surface border border-app-border animate-pulse"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-app-brand/10 flex items-center justify-center text-app-brand mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-app-fg">No Packages Found</h3>
            <p className="text-xs text-app-muted max-w-md mt-1">
              Try adjusting your search criteria such as travel date or number of days.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageSearchResultCard
                key={pkg.id}
                pkg={pkg}
                onCustomize={handleOpenCustomizeInNewTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
