import type { DayItineraryItem } from "../components/builder-steps/step-2-itinerary";

export interface Step1ValidationErrors {
  packageName?: string | undefined;
  clientId?: string | undefined;
  destinationId?: string | undefined;
  startDate?: string | undefined;
  numberOfDays?: string | undefined;
  adults?: string | undefined;
}

export interface Step1ValidationResult {
  isValid: boolean;
  errors: Step1ValidationErrors;
  firstError?: string | undefined;
}

export function validateStep1Data(data: {
  packageName: string;
  clientId?: string;
  destinationId: string;
  startDate?: string;
  numberOfDays: number;
}): Step1ValidationResult {
  const errors: Step1ValidationErrors = {};

  if (!data.packageName.trim()) {
    errors.packageName = "Package name is required";
  }
  if (!data.destinationId) {
    errors.destinationId = "Please select a destination";
  }
  if (!data.numberOfDays || data.numberOfDays < 1) {
    errors.numberOfDays = "Number of days must be at least 1";
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
  const emptyDays: number[] = [];

  for (let i = 1; i <= numberOfDays; i += 1) {
    const day = daysData.find((d) => d.dayNumber === i);
    const hasHotel = Boolean(day?.hotelId);

    if (!hasHotel) {
      emptyDays.push(i);
    }
  }

  const isValid = emptyDays.length === 0;
  const firstError =
    emptyDays.length > 0
      ? `Hotel selection is required for Day ${String(emptyDays[0])}. Please select a hotel.`
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
  clientId: string;
  destinationId: string;
  startDate: string;
  numberOfDays: number;
  adults: number;
  daysData: DayItineraryItem[];
}): {
  isValid: boolean;
  targetStep?: 1 | 2 | 3 | 4 | undefined;
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

  const v3 = validateStep3Data({
    adults: data.adults,
  });
  if (!v3.isValid) {
    return {
      isValid: false,
      targetStep: 3,
      firstError: v3.error ?? "Please complete Step 3: Traveler Details first",
    };
  }

  return { isValid: true };
}
