"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { CreateClientModal } from "@/features/clients/components/client-modals/create-client-modal";
import {
  step1Schema,
  type Step1FormData,
} from "@/features/packages/schemas/package.schema";

import {
  Step1FieldsGrid,
  buildSourceOptions,
  buildDestinationOptions,
} from "./step-1-fields-grid";

import type { Client } from "@/features/clients/types/client.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface Step1InfoProps {
  packageName: string;
  setPackageName: (val: string) => void;
  source: string;
  setSource: (val: string) => void;
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
  source,
  setSource,
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
  destinations: locations,
  onNext,
  showClientFields = false,
}: Step1InfoProps): React.JSX.Element {
  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    values: {
      packageName: packageName || "",
      source: source || "",
      destinationId: destinationId || "",
      clientId: clientId || "",
      startDate: startDate || "",
      validFrom: validFrom || "",
      validTo: validTo || "",
      numberOfDays: numberOfDays || 5,
    },
  });

  const locationSourceOptions = React.useMemo(
    () => buildSourceOptions(locations),
    [locations]
  );

  const locationDestinationOptions = React.useMemo(
    () => buildDestinationOptions(locations),
    [locations]
  );

  const onFormSubmit = (data: Step1FormData): void => {
    setPackageName(data.packageName);
    if (data.source) setSource(data.source);
    if (data.destinationId) setDestinationId(data.destinationId);
    if (setClientId && data.clientId) setClientId(data.clientId);
    if (setStartDate && data.startDate) setStartDate(data.startDate);
    if (setValidFrom) setValidFrom(data.validFrom);
    if (setValidTo) setValidTo(data.validTo);
    setNumberOfDays(data.numberOfDays);
    onNext();
  };

  return (
    <>
      <Card className="p-6">
        <form
          onSubmit={(e): void => {
            void handleSubmit(onFormSubmit)(e);
          }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">Basic Package Details</h2>
            <p className="text-xs text-muted-foreground">
              Define tour name, package validity dates, and duration.
            </p>
          </div>

          <Step1FieldsGrid
            register={register}
            errors={errors}
            setPackageName={setPackageName}
            sourceOptions={locationSourceOptions}
            setSource={setSource}
            showClientFields={showClientFields}
            setClientId={setClientId}
            clients={clients}
            onOpenClientModal={() => {
              setIsClientModalOpen(true);
            }}
            destinationOptions={locationDestinationOptions}
            setDestinationId={setDestinationId}
            setStartDate={setStartDate}
            setValidFrom={setValidFrom}
            setValidTo={setValidTo}
            setNumberOfDays={setNumberOfDays}
          />

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" className="gap-2">
              Next: Daily Itinerary
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
        }}
        onSuccess={(newClient) => {
          if (setClientId) {
            setClientId(newClient.id);
            setValue("clientId", newClient.id);
          }
        }}
      />
    </>
  );
}
