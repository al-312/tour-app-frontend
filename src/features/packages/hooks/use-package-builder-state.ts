"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useAppSelector } from "@/store/hooks";
import { apiTransformer } from "@/lib/api/api-transformer";
import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { useGetClientsQuery } from "@/features/clients/services/clients-api.slice";
import { useGetConsultantsQuery } from "@/features/consultants/services/consultants-api.slice";
import { useGetDestinationsQuery } from "@/features/destinations/services/destinations-api.slice";

import {
  buildPackagePayload,
  computeEditInitialState,
  resizeDaysData,
} from "../utils/package-builder-helpers";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const maxStep = isAdmin ? 3 : 4;

  const rawStep = parseInt(searchParams.get("step") ?? "1", 10);
  const step = (rawStep >= 1 && rawStep <= maxStep ? rawStep : 1) as 1 | 2 | 3 | 4;

  const setStep = React.useCallback(
    (targetStep: 1 | 2 | 3 | 4) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("step", String(targetStep));
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const { data: existingPkg, isLoading: isPkgLoading } = useGetPackageByIdQuery(
    pkgId ?? "",
    { skip: mode !== "edit" || !pkgId }
  );

  const [loadedPkgId, setLoadedPkgId] = React.useState<string | null>(null);
  const [appliedHotelId, setAppliedHotelId] = React.useState<string>("");

  const [packageName, setPackageName] = React.useState("");
  const [clientId, setClientId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [numberOfDays, setNumberOfDays] = React.useState(5);
  const [adults, setAdults] = React.useState(2);
  const [childrenCount, setChildrenCount] = React.useState(0);
  const [status, setStatus] = React.useState<"CONFIRMED" | "CANCELLED">("CONFIRMED");
  const [activeDay, setActiveDay] = React.useState(1);
  const [daysData, setDaysData] = React.useState<DayItineraryItem[]>(() => [
    { dayNumber: 1, hotelId: "", notes: "" },
    { dayNumber: 2, hotelId: "", notes: "" },
    { dayNumber: 3, hotelId: "", notes: "" },
    { dayNumber: 4, hotelId: "", notes: "" },
    { dayNumber: 5, hotelId: "", notes: "" },
  ]);
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
      prev.map((d) => ({
        ...d,
        hotelId: hotels.some((h) => h.id === d.hotelId) ? d.hotelId : firstHotelId,
      }))
    );
  }

  React.useEffect(() => {
    if (clientId && clients.length > 0) {
      if (!clients.some((c) => c.id === clientId)) {
        queueMicrotask(() => {
          setClientId("");
        });
      }
    }
  }, [clients, clientId]);

  React.useEffect(() => {
    if (consultants.length > 0 && consultants[0]) {
      if (!consultantId || !consultants.some((c) => c.id === consultantId)) {
        const defaultId = consultants[0].id;
        queueMicrotask(() => {
          setConsultantId(defaultId);
        });
      }
    }
  }, [consultants, consultantId]);

  if (mode === "edit" && existingPkg && loadedPkgId !== existingPkg.id) {
    setLoadedPkgId(existingPkg.id);
    const init = computeEditInitialState(existingPkg, clients, consultants, firstHotelId);
    setPackageName(init.packageName);
    setClientId(init.clientId);
    setDestinationId(init.destinationId);
    setStartDate(init.startDate);
    setNumberOfDays(init.numberOfDays);
    setAdults(init.adults);
    setChildrenCount(init.childrenCount);
    setStatus(init.status);
    setConsultantId(init.consultantId);
    setDaysData(init.daysData);
    setActiveDay(1);
  }

  const handleNumberOfDaysChange = (count: number): void => {
    setNumberOfDays(count);
    if (count > 0) {
      setDaysData((prev) => resizeDaysData(count, prev, firstHotelId));
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
      isAdmin,
    });
    if (!check.isValid) {
      if (check.firstError) toast.error(check.firstError);
      if (check.targetStep) setStep(check.targetStep);
      return;
    }

    try {
      const payload = buildPackagePayload({
        packageName,
        destinationId,
        numberOfDays,
        status,
        daysData,
        startDate,
        firstHotelId,
      });
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
