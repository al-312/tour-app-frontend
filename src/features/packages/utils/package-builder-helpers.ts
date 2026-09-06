import type { Client } from "@/features/clients/types/client.types";
import type { CreatePackageRequest, Package } from "../types/package.types";
import type { Consultant } from "@/features/consultants/types/consultant.types";
import type { DayItineraryItem } from "../components/builder-steps/step-2-itinerary";

export function buildPackagePayload({
  packageName,
  destinationId,
  clientId,
  numberOfDays,
  adults,
  childrenCount,
  status,
  daysData,
  startDate,
  firstHotelId,
}: {
  packageName: string;
  destinationId: string;
  clientId?: string;
  numberOfDays: number;
  adults?: number;
  childrenCount?: number;
  status: "CONFIRMED" | "CANCELLED";
  daysData: DayItineraryItem[];
  startDate: string;
  firstHotelId: string;
}): CreatePackageRequest {
  const payload: CreatePackageRequest = {
    packageName,
    source: "Bangalore",
    destinationId: destinationId || "",
    clientId: clientId ?? undefined,
    durationDays: numberOfDays,
    adults: adults ?? 2,
    children: childrenCount ?? 0,
    status,
    packageDays: daysData.map((day) => {
      const hotelId = day.hotelId ? day.hotelId : firstHotelId;
      const item: {
        dayNumber: number;
        hotelId?: string;
        roomTypeId?: string;
        notes?: string;
      } = {
        dayNumber: day.dayNumber,
      };
      if (hotelId) item.hotelId = hotelId;
      if (day.roomTypeId) item.roomTypeId = day.roomTypeId;
      if (day.notes) item.notes = day.notes;
      return item;
    }),
  };
  if (startDate) {
    payload.fromDatetimeUtc = new Date(startDate).toISOString();
  }
  return payload;
}

function resolveEditClientAndConsultant(
  existingPkg: Package,
  clients: Client[],
  consultants: Consultant[]
): { validClientId: string; validConsultantId: string } {
  const candidateClientId = existingPkg.clientId ?? existingPkg.client?.id;
  const validClientId =
    candidateClientId && clients.some((c) => c.id === candidateClientId)
      ? candidateClientId
      : "";

  const createdByVal = (existingPkg as unknown as Record<string, unknown>).createdBy;
  const candidateConsultantId =
    existingPkg.consultantId ??
    existingPkg.consultant?.id ??
    (typeof createdByVal === "string" ? createdByVal : undefined);
  const validConsultantId =
    candidateConsultantId && consultants.some((c) => c.id === candidateConsultantId)
      ? candidateConsultantId
      : (consultants[0]?.id ?? "");

  return { validClientId, validConsultantId };
}

function resolveEditDaysData(
  existingPkg: Package,
  pkgDuration: number,
  firstHotelId: string
): DayItineraryItem[] {
  const result: DayItineraryItem[] = [];
  for (let i = 1; i <= pkgDuration; i += 1) {
    const existing = existingPkg.packageDays.find((d) => d.dayNumber === i);
    result.push({
      dayNumber: i,
      hotelId: existing?.hotelId ?? firstHotelId,
      roomTypeId: existing?.roomTypeId ?? undefined,
      notes: existing?.notes ?? "",
    });
  }
  return result;
}

export function computeEditInitialState(
  existingPkg: Package,
  clients: Client[],
  consultants: Consultant[],
  firstHotelId: string
): {
  packageName: string;
  clientId: string;
  destinationId: string;
  startDate: string;
  numberOfDays: number;
  adults: number;
  childrenCount: number;
  status: "CONFIRMED" | "CANCELLED";
  consultantId: string;
  daysData: DayItineraryItem[];
} {
  const { validClientId, validConsultantId } = resolveEditClientAndConsultant(
    existingPkg,
    clients,
    consultants
  );

  const rawDate = existingPkg.fromDatetimeUtc ?? existingPkg.startDate;
  const formattedDate = rawDate ? new Date(rawDate).toISOString().split("T")[0] : "";
  const pkgDuration = existingPkg.durationDays > 0 ? existingPkg.durationDays : 5;
  const daysData = resolveEditDaysData(existingPkg, pkgDuration, firstHotelId);

  return {
    packageName: existingPkg.packageName,
    clientId: validClientId,
    destinationId: existingPkg.destinationId ?? "",
    startDate: formattedDate ?? "",
    numberOfDays: pkgDuration,
    adults: existingPkg.adults ?? 2,
    childrenCount: existingPkg.children ?? 0,
    status: existingPkg.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED",
    consultantId: validConsultantId,
    daysData,
  };
}

export function resizeDaysData(
  count: number,
  prev: DayItineraryItem[],
  firstHotelId: string
): DayItineraryItem[] {
  const result: DayItineraryItem[] = [];
  for (let i = 1; i <= count; i += 1) {
    const existing = prev.find((d) => d.dayNumber === i);
    result.push(existing ?? { dayNumber: i, hotelId: firstHotelId, notes: "" });
  }
  return result;
}
