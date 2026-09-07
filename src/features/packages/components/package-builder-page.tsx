"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/store/hooks";

import { PackageBuilderBody } from "./package-builder-body";
import { usePackageBuilderState } from "../hooks/use-package-builder-state";
import {
  StepIndicator,
  ADMIN_STEPS,
  CONSULTANT_STEPS,
} from "./builder-steps/step-indicator";

interface PackageBuilderPageProps {
  mode: "create" | "edit";
  pkgId?: string | undefined;
}

export function PackageBuilderPage({
  mode,
  pkgId,
}: PackageBuilderPageProps): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const steps = isAdmin ? ADMIN_STEPS : CONSULTANT_STEPS;

  const {
    router,
    step,
    isPkgLoading,
    packageName,
    setPackageName,
    source,
    setSource,
    clientId,
    setClientId,
    destinationId,
    setDestinationId,
    startDate,
    setStartDate,
    validFrom,
    setValidFrom,
    validTo,
    setValidTo,
    numberOfDays,
    handleNumberOfDaysChange,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    status,
    setStatus,
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
    handleStepClick,
    handleSubmitPackage,
  } = usePackageBuilderState({ mode, pkgId });

  if (mode === "edit" && isPkgLoading) {
    return (
      <div className="flex items-center justify-center p-16 text-sm font-semibold text-app-muted">
        Loading package details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push("/packages");
          }}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Packages
        </Button>
        <span className="text-xs font-semibold text-muted-foreground">
          {mode === "create" ? "New Package Mode" : `Editing Package #${pkgId ?? ""}`}
        </span>
      </div>

      {/* Page Title */}
      <div>
        <Heading level={1} size="2xl">
          {mode === "create" ? "Create Tour Package" : "Edit Tour Package"}
        </Heading>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          {isAdmin
            ? "Follow the 3-step wizard to define details, daily hotel stay, and preview template."
            : "Follow the 4-step wizard to define details, daily hotel stay, traveler counts, and preview proposal."}
        </p>
      </div>

      {/* Stepper Header */}
      <StepIndicator currentStep={step} steps={steps} onStepClick={handleStepClick} />

      {/* Active Step Content */}
      <PackageBuilderBody
        step={step}
        setStep={(s) => {
          handleStepClick(s);
        }}
        mode={mode}
        isAdmin={isAdmin}
        packageName={packageName}
        setPackageName={setPackageName}
        source={source}
        setSource={setSource}
        clientId={clientId}
        setClientId={setClientId}
        destinationId={destinationId}
        setDestinationId={setDestinationId}
        startDate={startDate}
        setStartDate={setStartDate}
        validFrom={validFrom}
        setValidFrom={setValidFrom}
        validTo={validTo}
        setValidTo={setValidTo}
        numberOfDays={numberOfDays}
        handleNumberOfDaysChange={handleNumberOfDaysChange}
        adults={adults}
        setAdults={setAdults}
        childrenCount={childrenCount}
        setChildrenCount={setChildrenCount}
        status={status}
        setStatus={setStatus}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        daysData={daysData}
        setDaysData={setDaysData}
        consultantId={consultantId}
        setConsultantId={setConsultantId}
        clients={clients}
        destinations={destinations}
        consultants={consultants}
        hotels={hotels}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitPackage}
      />
    </div>
  );
}
