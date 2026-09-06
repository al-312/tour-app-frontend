"use client";

import * as React from "react";
import { toast } from "sonner";
import { PackageCheck, MapPin, ChevronRight, Clock } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

import {
  validateStep1Data,
  type Step1ValidationErrors,
} from "../../utils/package-builder-validation";

import type { Destination } from "@/features/destinations/types/destination.types";

interface Step1InfoProps {
  packageName: string;
  setPackageName: (val: string) => void;
  destinationId: string;
  setDestinationId: (val: string) => void;
  numberOfDays: number;
  setNumberOfDays: (val: number) => void;
  destinations: Destination[];
  onNext: () => void;
}

export function Step1Info({
  packageName,
  setPackageName,
  destinationId,
  setDestinationId,
  numberOfDays,
  setNumberOfDays,
  destinations,
  onNext,
}: Step1InfoProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);

  const validation = validateStep1Data({
    packageName,
    destinationId,
    numberOfDays,
  });

  const errors: Step1ValidationErrors = touched ? validation.errors : {};

  const handleNextStep = (): void => {
    setTouched(true);
    if (!validation.isValid) {
      if (validation.firstError) {
        toast.error(validation.firstError);
      }
      return;
    }
    onNext();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Basic Master Package Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Define tour template name, main destination, and duration in days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Package Name *"
            placeholder="e.g. 5-Day Scenic Kerala Escape"
            value={packageName}
            error={errors.packageName}
            onChange={(e) => {
              setPackageName(e.target.value);
            }}
            icon={PackageCheck}
          />

          <Select
            label="Destination *"
            value={destinationId}
            error={errors.destinationId}
            onChange={(e) => {
              setDestinationId(e.target.value);
            }}
            icon={MapPin}
          >
            <option value="">Select destination...</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.country}
              </option>
            ))}
          </Select>

          <Input
            label="Number of Days *"
            type="number"
            min={1}
            max={30}
            value={numberOfDays === 0 ? "" : numberOfDays}
            error={errors.numberOfDays}
            onChange={(e) => {
              const raw = e.target.value;
              setNumberOfDays(raw === "" ? 0 : parseInt(raw, 10) || 0);
            }}
            icon={Clock}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={handleNextStep} className="gap-2">
            Next: Daily Itinerary
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
