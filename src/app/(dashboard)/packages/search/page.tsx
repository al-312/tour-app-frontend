"use client";

import * as React from "react";
import { Search, MapPin, Calendar, Users, Clock, Compass } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useSearchPackagesQuery } from "@/features/packages/services/packages-api.slice";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import { PackageSearchResultCard } from "./package-search-result-card";

export default function ConsultantPackageSearchPage(): React.JSX.Element {
  const [destinationId, setDestinationId] = React.useState("");
  const [source, setSource] = React.useState("Bangalore");
  const [travelDate, setTravelDate] = React.useState("2026-10-15");
  const [days, setDays] = React.useState<number | "">(5);
  const [adults, setAdults] = React.useState<number | "">(2);
  const [children, setChildren] = React.useState<number | "">(0);

  const [searchParams, setSearchParams] = React.useState<{
    destinationId?: string;
    source?: string;
    travelDate?: string;
    days?: number;
    adults?: number;
    children?: number;
  }>({});

  const { data: destinations = [] } = useGetDestinationsQuery(undefined);
  const {
    data: packages = [],
    isLoading,
    isFetching,
  } = useSearchPackagesQuery(searchParams);

  const handleSearch = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    const params: {
      destinationId?: string;
      source?: string;
      travelDate?: string;
      days?: number;
      adults?: number;
      children?: number;
    } = {};

    const finalDays = typeof days === "number" && days > 0 ? days : 1;
    const finalAdults = typeof adults === "number" && adults > 0 ? adults : 1;
    const finalChildren = typeof children === "number" && children >= 0 ? children : 0;

    if (destinationId) params.destinationId = destinationId;
    if (source) params.source = source;
    if (travelDate) params.travelDate = travelDate;
    if (finalDays) params.days = finalDays;
    if (finalAdults) params.adults = finalAdults;
    if (finalChildren) params.children = finalChildren;

    setSearchParams(params);
  };

  const handleOpenCustomizeInNewTab = (pkgId: string): void => {
    const finalDays = typeof days === "number" && days > 0 ? days : 1;
    const finalAdults = typeof adults === "number" && adults > 0 ? adults : 1;
    const finalChildren = typeof children === "number" && children >= 0 ? children : 0;

    const query = new URLSearchParams({
      destinationId,
      source,
      travelDate,
      days: finalDays.toString(),
      adults: finalAdults.toString(),
      children: finalChildren.toString(),
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
            Enter travel criteria below to search available curated travel packages for
            your clients. Selecting a package opens customization in a new browser tab.
          </p>
        </div>

        {/* Search Criteria Form */}
        <form
          onSubmit={handleSearch}
          className="mt-6 bg-app-surface/90 border border-app-border/80 rounded-2xl p-5 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-app-brand" />
              Destination
            </label>
            <select
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-app-muted" />
              Source City
            </label>
            <Input
              type="text"
              placeholder="e.g. Bangalore"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-app-muted" />
              Travel Date
            </label>
            <Input
              type="date"
              value={travelDate}
              onChange={(e) => {
                setTravelDate(e.target.value);
              }}
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
              value={days}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setDays("");
                } else {
                  const parsed = parseInt(val, 10);
                  setDays(isNaN(parsed) ? "" : parsed);
                }
              }}
              onBlur={() => {
                if (days === "" || days < 1) {
                  setDays(1);
                }
              }}
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
                value={adults}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setAdults("");
                  } else {
                    const parsed = parseInt(val, 10);
                    setAdults(isNaN(parsed) ? "" : parsed);
                  }
                }}
                onBlur={() => {
                  if (adults === "" || adults < 1) {
                    setAdults(1);
                  }
                }}
              />
              <Input
                type="number"
                min={0}
                title="Children"
                placeholder="Children"
                value={children}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setChildren("");
                  } else {
                    const parsed = parseInt(val, 10);
                    setChildren(isNaN(parsed) ? "" : parsed);
                  }
                }}
                onBlur={() => {
                  if (children === "" || children < 0) {
                    setChildren(0);
                  }
                }}
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
              Try adjusting your search criteria such as destination, source city, or
              number of days.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageSearchResultCard
                key={pkg.id}
                pkg={pkg}
                source={source}
                onCustomize={handleOpenCustomizeInNewTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
