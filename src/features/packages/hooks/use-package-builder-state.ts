"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { apiTransformer } from "@/lib/api/api-transformer";
import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { useGetClientsQuery } from "@/features/clients/services/clients-api.slice";
import { useGetConsultantsQuery } from "@/features/consultants/services/consultants-api.slice";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import {
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useGetPackageByIdQuery,
} from "../services/packages-api.slice";
import {
  validateStep1Data,
  validateStep2Data,
  validateStep3Data,
  validateAllSteps,
} from "../utils/package-builder-validation";

import type { CreatePackageRequest } from "../types/package.types";
import type { PackageBuilderHookState } from "../types/package-builder-state.types";
import type { DayItineraryItem } from "../components/builder-steps/step-2-itinerary";

interface UsePackageBuilderStateProps {
  mode: "create" | "edit";
  pkgId?: string | undefined;
}

export function usePackageBuilderState({
  mode,
  pkgId,
}: UsePackageBuilderStateProps): PackageBuilderHookState {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  const { data: existingPkg, isLoading: isPkgLoading } = useGetPackageByIdQuery(
    pkgId ?? "",
    { skip: mode !== "edit" || !pkgId }
  );

  const [loadedPkgId, setLoadedPkgId] = React.useState<string | null>(null);
  const [appliedHotelId, setAppliedHotelId] = React.useState<string>("");
  const [packageName, setPackageName] = React.useState("");
  const [clientId, setClientId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [numberOfDays, setNumberOfDays] = React.useState(5);
  const [adults, setAdults] = React.useState(2);
  const [childrenCount, setChildrenCount] = React.useState(0);
  const [status, setStatus] = React.useState<"CONFIRMED" | "CANCELLED">("CONFIRMED");
  const [activeDay, setActiveDay] = React.useState(1);
  const [daysData, setDaysData] = React.useState<DayItineraryItem[]>(() => {
    const initial: DayItineraryItem[] = [];
    for (let i = 1; i <= 5; i += 1) {
      initial.push({ dayNumber: i, hotelId: "", notes: "" });
    }
    return initial;
  });
  const [consultantId, setConsultantId] = React.useState("");

  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

  const { data: clients = [] } = useGetClientsQuery(undefined);
  const { data: destinations = [] } = useGetDestinationsQuery(undefined);
  const { data: consultants = [] } = useGetConsultantsQuery(undefined);
  const { data: allHotels = [] } = useGetHotelsQuery(undefined);

  const hotels = React.useMemo(() => {
    if (!destinationId) return allHotels;
    return allHotels.filter((h) => h.destinationId === destinationId);
  }, [allHotels, destinationId]);

  const firstHotelId = React.useMemo(() => hotels[0]?.id ?? "", [hotels]);

  if (firstHotelId && appliedHotelId !== firstHotelId) {
    setAppliedHotelId(firstHotelId);
    setDaysData((prev) =>
      prev.map((d) => {
        const isValid = hotels.some((h) => h.id === d.hotelId);
        return {
          ...d,
          hotelId: isValid ? d.hotelId : firstHotelId,
        };
      })
    );
  }

  if (mode === "edit" && existingPkg && loadedPkgId !== existingPkg.id) {
    setLoadedPkgId(existingPkg.id);
    setPackageName(existingPkg.packageName);
    setClientId(existingPkg.clientId ?? "");
    setDestinationId(existingPkg.destinationId ?? "");
    setStartDate(existingPkg.startDate ? existingPkg.startDate.slice(0, 10) : "");
    setNumberOfDays(existingPkg.numberOfDays);
    setAdults(existingPkg.adults);
    setChildrenCount(existingPkg.children);
    setStatus(existingPkg.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED");
    setConsultantId(existingPkg.consultantId ?? "");
    setActiveDay(1);

    if (existingPkg.packageDays.length > 0) {
      setDaysData(
        existingPkg.packageDays.map((d) => ({
          dayNumber: d.dayNumber,
          hotelId: d.hotelId ?? firstHotelId,
          notes: d.notes ?? "",
        }))
      );
    } else {
      const initialDays: DayItineraryItem[] = [];
      for (let i = 1; i <= existingPkg.numberOfDays; i += 1) {
        initialDays.push({ dayNumber: i, hotelId: firstHotelId, notes: "" });
      }
      setDaysData(initialDays);
    }
  }

  const handleNumberOfDaysChange = (count: number): void => {
    setNumberOfDays(count);
    if (count > 0) {
      setDaysData((prev) => {
        const result: DayItineraryItem[] = [];
        for (let i = 1; i <= count; i += 1) {
          const existing = prev.find((d) => d.dayNumber === i);
          result.push(existing ?? { dayNumber: i, hotelId: firstHotelId, notes: "" });
        }
        return result;
      });
      if (activeDay > count) setActiveDay(1);
    }
  };

  const handleStepClick = (targetStep: number): void => {
    if (targetStep > 1) {
      const v1 = validateStep1Data({
        packageName,
        clientId,
        destinationId,
        startDate,
        numberOfDays,
        adults,
      });
      if (!v1.isValid) {
        toast.error(v1.firstError ?? "Please complete Step 1: Basic Info first");
        return;
      }
    }
    if (targetStep > 2) {
      const v2 = validateStep2Data(daysData, numberOfDays);
      if (!v2.isValid) {
        toast.error(v2.firstError ?? "Please complete Step 2: Daily Itinerary first");
        return;
      }
    }
    if (targetStep > 3) {
      const v3 = validateStep3Data(consultantId);
      if (!v3.isValid) {
        toast.error(v3.error ?? "Please select a Travel Consultant in Step 3 first");
        return;
      }
    }
    setStep(targetStep as 1 | 2 | 3 | 4);
  };

  const getPayload = (): CreatePackageRequest => ({
    packageName,
    clientId: clientId || undefined,
    destinationId: destinationId || undefined,
    consultantId: consultantId || undefined,
    startDate: startDate || undefined,
    numberOfDays,
    adults,
    children: childrenCount,
    status,
    packageDays: daysData.map((day) => ({
      dayNumber: day.dayNumber,
      hotelId: day.hotelId || firstHotelId,
      notes: day.notes || undefined,
    })),
  });

  const handleSubmitPackage = async (): Promise<void> => {
    const check = validateAllSteps({
      packageName,
      clientId,
      destinationId,
      startDate,
      numberOfDays,
      adults,
      daysData,
      consultantId,
    });
    if (!check.isValid) {
      if (check.firstError) toast.error(check.firstError);
      if (check.targetStep) setStep(check.targetStep);
      return;
    }

    try {
      const payload = getPayload();
      if (mode === "create") {
        await createPackage(payload).unwrap();
        toast.success(`Tour Package "${packageName}" created successfully!`);
      } else if (pkgId) {
        await updatePackage({ id: pkgId, data: payload }).unwrap();
        toast.success(`Tour Package "${packageName}" updated successfully!`);
      }
      router.push("/packages");
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to save tour package"));
    }
  };

  return {
    router,
    step,
    setStep,
    isPkgLoading,
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
    isSubmitting: isCreating || isUpdating,
    handleStepClick,
    handleSubmitPackage,
  };
}
