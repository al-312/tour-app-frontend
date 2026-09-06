"use client";

import * as React from "react";

import { Step1Info } from "./builder-steps/step-1-info";
import { Step4PreviewExport } from "./builder-steps/step-4-preview-export";
import { Step3ConsultantSelect } from "./builder-steps/step-3-consultant-select";
import { Step2Itinerary, type DayItineraryItem } from "./builder-steps/step-2-itinerary";

import type { Hotel } from "@/features/hotels/types/hotel.types";
import type { Client } from "@/features/clients/types/client.types";
import type { Consultant } from "@/features/consultants/types/consultant.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface PackageBuilderBodyProps {
  step: 1 | 2 | 3 | 4;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  mode: "create" | "edit";
  packageName: string;
  setPackageName: (val: string) => void;
  clientId: string;
  setClientId: (val: string) => void;
  destinationId: string;
  setDestinationId: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  numberOfDays: number;
  handleNumberOfDaysChange: (count: number) => void;
  adults: number;
  setAdults: (val: number) => void;
  childrenCount: number;
  setChildrenCount: (val: number) => void;
  status: "CONFIRMED" | "CANCELLED";
  setStatus: (val: "CONFIRMED" | "CANCELLED") => void;
  activeDay: number;
  setActiveDay: (day: number) => void;
  daysData: DayItineraryItem[];
  setDaysData: React.Dispatch<React.SetStateAction<DayItineraryItem[]>>;
  consultantId: string;
  setConsultantId: (id: string) => void;
  clients: Client[];
  destinations: Destination[];
  consultants: Consultant[];
  hotels: Hotel[];
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  isAdmin?: boolean;
}

export function PackageBuilderBody(props: PackageBuilderBodyProps): React.JSX.Element {
  const {
    step,
    setStep,
    mode,
    packageName,
    setPackageName,
    clientId,
    setClientId,
    destinationId,
    setDestinationId,
    startDate,
    setStartDate,
    numberOfDays,
    handleNumberOfDaysChange,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    status,
    activeDay,
    setActiveDay,
    daysData,
    setDaysData,
    consultantId,
    setConsultantId,
    clients,
    destinations,
    consultants,
    hotels,
    isSubmitting,
    onSubmit,
  } = props;

  if (step === 1) {
    return (
      <Step1Info
        packageName={packageName}
        setPackageName={setPackageName}
        clientId={clientId}
        setClientId={setClientId}
        destinationId={destinationId}
        setDestinationId={setDestinationId}
        startDate={startDate}
        setStartDate={setStartDate}
        numberOfDays={numberOfDays}
        setNumberOfDays={handleNumberOfDaysChange}
        clients={clients}
        destinations={destinations}
        showClientFields={true}
        onNext={() => {
          setStep(2);
        }}
      />
    );
  }

  if (step === 2) {
    return (
      <Step2Itinerary
        numberOfDays={numberOfDays}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        daysData={daysData}
        setDaysData={setDaysData}
        hotels={hotels}
        onBack={() => {
          setStep(1);
        }}
        onNext={() => {
          setStep(3);
        }}
        nextButtonText="Next: Traveler Details"
      />
    );
  }

  if (step === 3) {
    return (
      <Step3ConsultantSelect
        consultantId={consultantId}
        setConsultantId={setConsultantId}
        adults={adults}
        setAdults={setAdults}
        childrenCount={childrenCount}
        setChildrenCount={setChildrenCount}
        onBack={() => {
          setStep(2);
        }}
        onNext={() => {
          setStep(4);
        }}
      />
    );
  }

  return (
    <Step4PreviewExport
      mode={mode}
      packageName={packageName}
      startDate={startDate}
      numberOfDays={numberOfDays}
      adults={adults}
      childrenCount={childrenCount}
      status={status}
      selectedClient={clients.find((c) => c.id === clientId)}
      selectedDestination={destinations.find((d) => d.id === destinationId)}
      selectedConsultant={consultants.find((c) => c.id === consultantId)}
      daysData={daysData}
      hotels={hotels}
      isSubmitting={isSubmitting}
      onBack={() => {
        setStep(3);
      }}
      onSubmit={onSubmit}
    />
  );
}
