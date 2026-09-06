"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  type Inquiry,
} from "@/features/inquiries/services/inquiries-api.slice";

import { ClientDetailsCard } from "./client-details-card";
import { HotelBreakdownCard } from "./hotel-breakdown-card";
import { AdminReviewControls } from "./admin-review-controls";

interface HotelSelectionSnapshot {
  dayNumber?: number;
  hotelName?: string;
  roomTypeName?: string;
  numberOfRooms?: number;
  numberOfExtraBeds?: number;
  calculatedTotal?: number;
}

interface PackageSnapshot {
  packageName?: string;
  clientName?: string;
  destinationName?: string;
  hotelSelections?: HotelSelectionSnapshot[];
}

function getInquiryDisplayNames(
  inquiry: Inquiry,
  snap: PackageSnapshot
): {
  clientDisplayName: string;
  consultantDisplayName: string;
} {
  const clientFullName = [inquiry.client?.firstName, inquiry.client?.lastName]
    .filter(Boolean)
    .join(" ");
  const clientDisplayName =
    inquiry.client?.name ??
    (clientFullName ? clientFullName : (snap.clientName ?? "Client Record"));

  const consultantFullName = [inquiry.consultant?.firstName, inquiry.consultant?.lastName]
    .filter(Boolean)
    .join(" ");
  const consultantDisplayName =
    inquiry.consultant?.name ?? (consultantFullName ? consultantFullName : "Consultant");

  return { clientDisplayName, consultantDisplayName };
}

export default function InquiryDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const inquiryId = params.id as string;

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const { data: inquiry, isLoading } = useGetInquiryByIdQuery(inquiryId, {
    skip: !inquiryId,
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateInquiryStatusMutation();

  const [approvedTotal, setApprovedTotal] = React.useState<number>(0);
  const [notes, setNotes] = React.useState<string>("");
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const [prevInquiryId, setPrevInquiryId] = React.useState<string | null>(null);
  if (inquiry && inquiry.id !== prevInquiryId) {
    setPrevInquiryId(inquiry.id);
    setApprovedTotal(inquiry.approvedTotal ?? inquiry.calculatedTotal);
    setNotes(inquiry.notes ?? "");
  }

  const handleUpdateStatus = async (newStatus: string): Promise<void> => {
    setStatusMsg(null);
    try {
      await updateStatus({
        id: inquiryId,
        status: newStatus,
        ...(approvedTotal ? { approvedTotal } : {}),
        ...(notes ? { notes } : {}),
      }).unwrap();
      setStatusMsg(`Status updated to ${newStatus} successfully!`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setStatusMsg(error.data?.message ?? "Failed to update status.");
    }
  };

  if (isLoading || !inquiry) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-app-brand/20 border-t-app-brand rounded-full animate-spin" />
      </div>
    );
  }

  const snap = (inquiry.packageSnapshot ?? {}) as PackageSnapshot;
  const { clientDisplayName, consultantDisplayName } = getInquiryDisplayNames(
    inquiry,
    snap
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={(): void => {
              router.push("/inquiries");
            }}
            className="p-2.5 rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-app-fg font-display-lg">
                {inquiry.inquiryNumber}
              </span>
              <Badge variant="brand">{inquiry.status}</Badge>
            </div>
            <span className="text-xs text-app-muted block mt-0.5">
              Submitted on {new Date(inquiry.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-app-brand/10 border border-app-brand/20 text-app-brand text-xs font-semibold">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ClientDetailsCard
            inquiry={inquiry}
            clientDisplayName={clientDisplayName}
            consultantDisplayName={consultantDisplayName}
          />
          <HotelBreakdownCard inquiry={inquiry} snap={snap} />
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6 border-app-border/80 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-app-fg border-b border-app-border/40 pb-2">
              Pricing Summary
            </h3>

            <div className="flex justify-between items-center text-xs">
              <span className="text-app-muted">Server Recalculated Total:</span>
              <span className="text-sm font-bold text-app-fg">
                ${inquiry.calculatedTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-app-border/40 pt-3">
              <span className="font-bold text-app-fg">Approved Final Total:</span>
              <span className="text-xl font-extrabold text-app-brand">
                ${(inquiry.approvedTotal ?? inquiry.calculatedTotal).toLocaleString()} USD
              </span>
            </div>

            {isAdmin && (
              <AdminReviewControls
                approvedTotal={approvedTotal}
                onApprovedTotalChange={setApprovedTotal}
                notes={notes}
                onNotesChange={setNotes}
                isUpdating={isUpdating}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
