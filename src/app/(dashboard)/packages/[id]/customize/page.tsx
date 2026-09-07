"use client";

import * as React from "react";
import { Building2 } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { useGetHotelsQuery } from "@/features/hotels/services/hotels-api.slice";
import { useGetPackageByIdQuery } from "@/features/packages/services/packages-api.slice";
import { useCreateInquiryMutation } from "@/features/inquiries/services/inquiries-api.slice";
import {
  useGetClientsQuery,
  useCreateClientMutation,
} from "@/features/clients/services/clients-api.slice";

import { CustomizeHeader } from "./customize-header";
import { CustomizeDayCard } from "./customize-day-card";
import { CustomizeClientModal } from "./customize-client-modal";
import { CustomizeClientSection } from "./customize-client-section";
import { useCustomizeInquiryState } from "./use-customize-inquiry-state";

export default function PackageCustomizePage(): React.JSX.Element {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const packageId = params.id as string;
  const urlSource = searchParams.get("source");
  const paramTravelDate = searchParams.get("travelDate");
  const paramAdults = parseInt(searchParams.get("adults") ?? "2", 10);
  const paramChildren = parseInt(searchParams.get("children") ?? "0", 10);

  const defaultDate = React.useMemo(() => {
    if (paramTravelDate) return paramTravelDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0] ?? "2026-10-15";
  }, [paramTravelDate]);

  const { data: pkg, isLoading: isPkgLoading } = useGetPackageByIdQuery(packageId, {
    skip: !packageId,
  });
  const { data: hotelsData } = useGetHotelsQuery(undefined);
  const { data: clientsData } = useGetClientsQuery(undefined);

  const [createInquiry, { isLoading: isSubmittingInquiry }] = useCreateInquiryMutation();
  const [createClient, { isLoading: isCreatingClient }] = useCreateClientMutation();

  const allHotels = React.useMemo(() => hotelsData ?? [], [hotelsData]);
  const clients = React.useMemo(() => clientsData ?? [], [clientsData]);
  const initialSource = urlSource ?? pkg?.source ?? "Bangalore";

  const [selectedClientId, setSelectedClientId] = React.useState<string>("");
  const [travelDate, setTravelDate] = React.useState<string>(defaultDate);
  const [adults, setAdults] = React.useState<number>(
    Number.isNaN(paramAdults) ? 2 : paramAdults
  );
  const [childrenCount, setChildrenCount] = React.useState<number>(
    Number.isNaN(paramChildren) ? 0 : paramChildren
  );

  const {
    daySelections,
    handleAdultsChange,
    handleHotelOrRoomTypeChange,
    totalCalculatedPackagePrice,
  } = useCustomizeInquiryState({
    pkg,
    allHotels,
    adults,
    setAdults,
  });

  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmitInquiry = async (): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!pkg) return;
    if (!selectedClientId) {
      setErrorMessage("Please select or create a Client for this inquiry.");
      return;
    }
    if (!travelDate) {
      setErrorMessage("Please specify a Travel Start Date for this inquiry.");
      return;
    }

    try {
      const hotelSelections = Object.values(daySelections)
        .filter((ds) => ds.hotelId && ds.roomTypeId)
        .map((ds) => ({
          dayNumber: ds.dayNumber,
          destinationId: ds.destinationId,
          destinationName: ds.destinationName,
          hotelId: ds.hotelId,
          roomTypeId: ds.roomTypeId,
          roomsCount: ds.roomsCount,
          extraBedsCount: ds.extraBedsCount,
          calculatedPrice: ds.calculatedPrice,
          notes: ds.notes,
        }));

      const daysCount =
        pkg.durationDays > 0
          ? pkg.durationDays
          : pkg.packageDays.length > 0
            ? pkg.packageDays.length
            : 1;
      const inquiry = await createInquiry({
        clientId: selectedClientId,
        packageId: pkg.id,
        source: initialSource,
        destinationId: pkg.destinationId ?? "",
        travelDate,
        days: daysCount,
        adults,
        children: childrenCount,
        calculatedTotal: totalCalculatedPackagePrice,
        packageSnapshot: {
          packageName: pkg.packageName,
          clientName: clients.find((c) => c.id === selectedClientId)?.name,
          destinationName: pkg.destination?.name,
          hotelSelections,
        },
      }).unwrap();

      setSuccessMessage(
        `Inquiry ${inquiry.inquiryNumber} submitted successfully! Redirecting...`
      );
      setTimeout(() => {
        router.push("/inquiries");
      }, 1500);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string } | undefined;
      const msg = apiErr?.data?.message ?? apiErr?.message;
      setErrorMessage(msg ?? "Failed to submit inquiry.");
    }
  };

  if (isPkgLoading || !pkg) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-app-brand/20 border-t-app-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16 pt-6">
      <CustomizeHeader
        durationDays={pkg.durationDays}
        packageName={pkg.packageName}
        totalCalculatedPackagePrice={totalCalculatedPackagePrice}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-base font-bold text-app-fg font-display-md flex items-center gap-2">
            <Building2 className="w-4 h-4 text-app-brand" />
            Itinerary Hotel Selection & Room Allocation
          </h2>

          {pkg.packageDays.map((pd) => {
            const daySel = daySelections[pd.dayNumber] ?? {
              dayNumber: pd.dayNumber,
              destinationId: pd.destinationId ?? pkg.destinationId ?? "",
              destinationName:
                pd.destination?.name ?? pkg.destination?.name ?? "Destination",
              hotelId: "",
              roomTypeId: "",
              roomsCount: 0,
              extraBedsCount: 0,
              calculatedPrice: 0,
            };
            const dayDestId = pd.destinationId ?? pkg.destinationId ?? "";

            return (
              <CustomizeDayCard
                key={pd.dayNumber}
                dayNumber={pd.dayNumber}
                notes={pd.notes}
                destinationName={pd.destination?.name}
                dayDestinationId={dayDestId}
                mainDestinationName={pkg.destination?.name}
                daySel={daySel}
                allHotels={allHotels}
                initialAdults={adults}
                onHotelOrRoomTypeChange={handleHotelOrRoomTypeChange}
              />
            );
          })}
        </div>

        <CustomizeClientSection
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
          onOpenCreateClientModal={(): void => {
            setIsClientModalOpen(true);
          }}
          travelDate={travelDate}
          onTravelDateChange={setTravelDate}
          adults={adults}
          onAdultsChange={handleAdultsChange}
          childrenCount={childrenCount}
          onChildrenCountChange={setChildrenCount}
          initialSource={initialSource}
          isSubmittingInquiry={isSubmittingInquiry}
          onSubmitInquiry={handleSubmitInquiry}
        />
      </div>

      <CustomizeClientModal
        isOpen={isClientModalOpen}
        onClose={(): void => {
          setIsClientModalOpen(false);
        }}
        onClientCreated={setSelectedClientId}
        createClient={createClient}
        isCreatingClient={isCreatingClient}
        onSetErrorMessage={setErrorMessage}
      />
    </div>
  );
}
