"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { HotelFormPage } from "@/features/hotels/components/hotel-form-page";

export default function EditHotelPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const hotelId = params.id;

  return <HotelFormPage mode="edit" hotelId={hotelId} />;
}
