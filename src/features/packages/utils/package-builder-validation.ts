import type { DayItineraryItem } from "../components/builder-steps/step-2-itinerary";

export interface Step1ValidationErrors {
  packageName?: string | undefined;
  source?: string | undefined;
  destinationId?: string | undefined;
  numberOfDays?: string | undefined;
  clientId?: string | undefined;
  startDate?: string | undefined;
  validFrom?: string | undefined;
  validTo?: string | undefined;
}

export interface Step1ValidationResult {
  isValid: boolean;
  errors: Step1ValidationErrors;
  firstError?: string | undefined;
}

export function validateStep1Data(data: {
  packageName: string;
  source?: string | undefined;
  destinationId?: string | undefined;
  numberOfDays: number;
  validFrom?: string | undefined;
  validTo?: string | undefined;
}): Step1ValidationResult {
  const errors: Step1ValidationErrors = {};

  if (!data.packageName.trim()) {
    errors.packageName = "Package name is required";
  }
  if (!data.numberOfDays || data.numberOfDays < 1) {
    errors.numberOfDays = "Number of days must be at least 1";
  }
  if (!data.validFrom) {
    errors.validFrom = "Valid From date is required";
  }
  if (!data.validTo) {
    errors.validTo = "Valid To date is required";
  } else if (
    data.validFrom &&
    data.validTo &&
    new Date(data.validTo) < new Date(data.validFrom)
  ) {
    errors.validTo = "Valid To date cannot be earlier than Valid From date";
  }

  const keys = Object.keys(errors) as (keyof Step1ValidationErrors)[];
  const errorList: string[] = [];
  for (const k of keys) {
    const msg = errors[k];
    if (msg) errorList.push(msg);
  }

  const firstError = errorList.length > 0 ? errorList[0] : undefined;

  return {
    isValid: errorList.length === 0,
    errors,
    firstError,
  };
}

export interface Step2ValidationResult {
  isValid: boolean;
  emptyDays: number[];
  firstError?: string | undefined;
}

export function validateStep2Data(
  daysData: DayItineraryItem[],
  numberOfDays: number
): Step2ValidationResult {
  const invalidDays: { dayNumber: number; reason: "destination" | "hotel" }[] = [];

  for (let i = 1; i <= numberOfDays; i += 1) {
    const day = daysData.find((d) => d.dayNumber === i);
    const hasDestination = Boolean(day?.destinationId?.trim());
    const hasHotel = Boolean(day?.hotelId.trim());

    if (!hasDestination) {
      invalidDays.push({ dayNumber: i, reason: "destination" });
    } else if (!hasHotel) {
      invalidDays.push({ dayNumber: i, reason: "hotel" });
    }
  }

  const isValid = invalidDays.length === 0;
  const emptyDays = invalidDays.map((d) => d.dayNumber);
  const firstInvalid = invalidDays[0];

  const firstError = firstInvalid
    ? firstInvalid.reason === "destination"
      ? `Destination selection is required for Day ${String(firstInvalid.dayNumber)}. Please select a destination.`
      : `Hotel selection is required for Day ${String(firstInvalid.dayNumber)}. Please select a hotel.`
    : undefined;

  return {
    isValid,
    emptyDays,
    firstError,
  };
}

export interface Step3ValidationResult {
  isValid: boolean;
  error?: string | undefined;
}

export function validateStep3Data(data: {
  adults?: number | undefined;
}): Step3ValidationResult {
  if (data.adults !== undefined && data.adults < 1) {
    return {
      isValid: false,
      error: "Adult travelers must be at least 1",
    };
  }
  return { isValid: true };
}

export function validateAllSteps(data: {
  packageName: string;
  source?: string | undefined;
  destinationId?: string | undefined;
  numberOfDays: number;
  daysData: DayItineraryItem[];
}): {
  isValid: boolean;
  targetStep?: 1 | 2 | 3 | undefined;
  firstError?: string | undefined;
} {
  const v1 = validateStep1Data(data);
  if (!v1.isValid) {
    return {
      isValid: false,
      targetStep: 1,
      firstError: v1.firstError ?? "Please complete Step 1: Basic Info first",
    };
  }

  const v2 = validateStep2Data(data.daysData, data.numberOfDays);
  if (!v2.isValid) {
    return {
      isValid: false,
      targetStep: 2,
      firstError: v2.firstError ?? "Please complete Step 2: Daily Itinerary first",
    };
  }

  return { isValid: true };
}
