"use client";

import * as React from "react";
import { PackageCheck, UserCheck, Calendar, Plus, Clock } from "lucide-react";

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Client } from "@/features/clients/types/client.types";
import type { Step1FormData } from "@/features/packages/schemas/package.schema";
import type { Destination } from "@/features/destinations/types/destination.types";

export function buildSourceOptions(
  locations: Destination[]
): { value: string; label: string }[] {
  return [
    { value: "", label: "Select Source Location..." },
    ...locations.map((loc) => ({
      value: loc.name,
      label: `${loc.name} (${loc.country})`,
    })),
  ];
}

export function buildDestinationOptions(
  locations: Destination[]
): { value: string; label: string }[] {
  return [
    { value: "", label: "Select Destination Location..." },
    ...locations.map((loc) => ({
      value: loc.id,
      label: `${loc.name} (${loc.country})`,
    })),
  ];
}

function ClientSelectField({
  clients,
  error,
  register,
  setClientId,
  onOpenModal,
}: {
  clients: Client[];
  error?: string | undefined;
  register: UseFormRegister<Step1FormData>;
  setClientId?: ((val: string) => void) | undefined;
  onOpenModal: () => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Assign Client (Optional)
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenModal}
          className="text-xs text-primary hover:text-primary/80 h-auto py-0.5 px-2 gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Client
        </Button>
      </div>
      <Select
        icon={UserCheck}
        error={error}
        {...register("clientId", {
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (setClientId) setClientId(e.target.value);
          },
        })}
      >
        <option value="">Select a client (optional)...</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Client"}
          </option>
        ))}
      </Select>
    </div>
  );
}

export interface Step1FieldsGridProps {
  register: UseFormRegister<Step1FormData>;
  errors: FieldErrors<Step1FormData>;
  setPackageName: (val: string) => void;
  sourceOptions?: { value: string; label: string }[] | undefined;
  setSource?: ((val: string) => void) | undefined;
  showClientFields?: boolean | undefined;
  setClientId?: ((val: string) => void) | undefined;
  clients: Client[];
  onOpenClientModal: () => void;
  destinationOptions?: { value: string; label: string }[] | undefined;
  setDestinationId?: ((val: string) => void) | undefined;
  setStartDate?: ((val: string) => void) | undefined;
  setValidFrom?: ((val: string) => void) | undefined;
  setValidTo?: ((val: string) => void) | undefined;
  setNumberOfDays: (val: number) => void;
}

export function Step1FieldsGrid({
  register,
  errors,
  setPackageName,
  showClientFields,
  setClientId,
  clients,
  onOpenClientModal,
  setStartDate,
  setValidFrom,
  setValidTo,
  setNumberOfDays,
}: Step1FieldsGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Package Name *"
        placeholder="e.g. 5-Day Scenic Kerala Escape"
        icon={PackageCheck}
        error={errors.packageName?.message}
        {...register("packageName", {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setPackageName(e.target.value);
          },
        })}
      />

      {showClientFields && setClientId ? (
        <ClientSelectField
          clients={clients}
          error={errors.clientId?.message}
          register={register}
          setClientId={setClientId}
          onOpenModal={onOpenClientModal}
        />
      ) : null}

      {showClientFields && setStartDate ? (
        <Input
          label="Tour Start Date (Optional)"
          type="date"
          icon={Calendar}
          error={errors.startDate?.message}
          {...register("startDate", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setStartDate(e.target.value);
            },
          })}
        />
      ) : null}

      {setValidFrom ? (
        <Input
          label="Valid From Date *"
          type="date"
          icon={Calendar}
          error={errors.validFrom?.message}
          {...register("validFrom", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValidFrom(e.target.value);
            },
          })}
        />
      ) : null}

      {setValidTo ? (
        <Input
          label="Valid To Date *"
          type="date"
          icon={Calendar}
          error={errors.validTo?.message}
          {...register("validTo", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValidTo(e.target.value);
            },
          })}
        />
      ) : null}

      <Input
        label="Number of Days *"
        type="number"
        min={1}
        max={30}
        icon={Clock}
        error={errors.numberOfDays?.message}
        {...register("numberOfDays", {
          valueAsNumber: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            const num = raw === "" ? 0 : parseInt(raw, 10) || 0;
            setNumberOfDays(num);
          },
        })}
      />
    </div>
  );
}
