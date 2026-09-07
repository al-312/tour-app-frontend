"use client";

import * as React from "react";
import { Clock, ExternalLink } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

import type { Package } from "@/features/packages/types/package.types";

interface PackageSearchResultCardProps {
  pkg: Package;
  source: string;
  onCustomize: (pkgId: string) => void;
}

export function PackageSearchResultCard({
  pkg,
  source,
  onCustomize,
}: PackageSearchResultCardProps): React.JSX.Element {
  const displaySource = pkg.source !== "" ? pkg.source : source;
  const daysCount =
    pkg.packageDays.length > 0 ? pkg.packageDays.length : pkg.durationDays;

  return (
    <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group border-app-border/80">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="brand" className="mb-2">
              {pkg.durationDays} Days Tour
            </Badge>
            <h3 className="text-base font-extrabold text-app-fg group-hover:text-app-brand transition-colors line-clamp-1">
              {pkg.packageName}
            </h3>
          </div>
        </div>

        <p className="text-xs text-app-muted line-clamp-2 leading-relaxed">
          {pkg.summary ??
            "Complete curated tour itinerary package with premium hotels and transport."}
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-app-surface-variant/60 border border-app-border/40 text-xs">
          <div>
            <span className="text-[10px] text-app-muted block font-medium">Source:</span>
            <span className="font-semibold text-app-fg">{displaySource}</span>
          </div>
          <div>
            <span className="text-[10px] text-app-muted block font-medium">
              Destination:
            </span>
            <span className="font-semibold text-app-fg">
              {pkg.destination?.name ?? "Main Destination"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-app-border/40 flex items-center justify-between">
        <span className="text-[11px] font-medium text-app-muted flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {daysCount} Days Itinerary
        </span>

        <Button
          type="button"
          onClick={() => {
            onCustomize(pkg.id);
          }}
          className="gap-2 text-xs py-2"
        >
          <span>Customize & Book</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
