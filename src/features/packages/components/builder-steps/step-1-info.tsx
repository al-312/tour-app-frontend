"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PackageCheck,
  UserCheck,
  MapPin,
  Calendar,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { CreateClientModal } from "@/features/clients/components/client-modals/create-client-modal";

import {
  validateStep1Data,
  type Step1ValidationErrors,
} from "../../utils/package-builder-validation";

import type { Client } from "@/features/clients/types/client.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface Step1InfoProps {
  packageName: string;
  setPackageName: (val: string) => void;
  clientId?: string | undefined;
  setClientId?: ((val: string) => void) | undefined;
  destinationId: string;
  setDestinationId: (val: string) => void;
  startDate?: string | undefined;
  setStartDate?: ((val: string) => void) | undefined;
  validFrom?: string | undefined;
  setValidFrom?: ((val: string) => void) | undefined;
  validTo?: string | undefined;
  setValidTo?: ((val: string) => void) | undefined;
  numberOfDays: number;
  setNumberOfDays: (val: number) => void;
  clients?: Client[] | undefined;
  destinations: Destination[];
  onNext: () => void;
  showClientFields?: boolean | undefined;
}

export function Step1Info({
  packageName,
  setPackageName,
  clientId = "",
  setClientId,
  destinationId,
  setDestinationId,
  startDate = "",
  setStartDate,
  validFrom = "",
  setValidFrom,
  validTo = "",
  setValidTo,
  numberOfDays,
  setNumberOfDays,
  clients = [],
  destinations,
  onNext,
  showClientFields = false,
}: Step1InfoProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);

  const validation = validateStep1Data({
    packageName,
    destinationId,
    numberOfDays,
    validFrom,
    validTo,
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
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Basic Package Details</h2>
            <p className="text-xs text-muted-foreground">
              Define tour name, destination, package validity dates, and duration.
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

            {showClientFields && setClientId ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Assign Client (Optional)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsClientModalOpen(true);
                    }}
                    className="text-xs text-primary hover:text-primary/80 h-auto py-0.5 px-2 gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Client
                  </Button>
                </div>
                <Select
                  value={clientId}
                  error={errors.clientId}
                  onChange={(e) => {
                    setClientId(e.target.value);
                  }}
                  icon={UserCheck}
                >
                  <option value="">Select a client (optional)...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name ||
                        [c.firstName, c.lastName].filter(Boolean).join(" ") ||
                        "Client"}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

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

            {showClientFields && setStartDate ? (
              <Input
                label="Tour Start Date (Optional)"
                type="date"
                value={startDate}
                error={errors.startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                icon={Calendar}
              />
            ) : null}

            {setValidFrom ? (
              <Input
                label="Valid From Date *"
                type="date"
                value={validFrom}
                error={errors.validFrom}
                onChange={(e) => {
                  setValidFrom(e.target.value);
                }}
                icon={Calendar}
              />
            ) : null}

            {setValidTo ? (
              <Input
                label="Valid To Date *"
                type="date"
                value={validTo}
                error={errors.validTo}
                onChange={(e) => {
                  setValidTo(e.target.value);
                }}
                icon={Calendar}
              />
            ) : null}

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

      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
        }}
        onSuccess={(newClient) => {
          if (setClientId) setClientId(newClient.id);
        }}
      />
    </>
  );
}
