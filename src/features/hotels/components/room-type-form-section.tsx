"use client";

import * as React from "react";
import { toast } from "sonner";
import { BedDouble, DollarSign, Plus, X } from "lucide-react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import type { CreateRoomTypeRequest } from "../types/hotel.types";

interface RoomTypeFormSectionProps {
  roomTypes: CreateRoomTypeRequest[];
  onAddRoomType: (room: CreateRoomTypeRequest) => void;
  onRemoveRoomType: (index: number) => void;
}

export function RoomTypeFormSection({
  roomTypes,
  onAddRoomType,
  onRemoveRoomType,
}: RoomTypeFormSectionProps): React.JSX.Element {
  const [roomName, setRoomName] = React.useState("");
  const [roomPrice, setRoomPrice] = React.useState<number>(100);
  const [extraBedPrice, setExtraBedPrice] = React.useState<number>(30);
  const [maxAdults, setMaxAdults] = React.useState<number>(2);
  const [maxChildren, setMaxChildren] = React.useState<number>(1);
  const [extraBedAvailable, setExtraBedAvailable] = React.useState<boolean>(true);
  const [maxExtraBeds, setMaxExtraBeds] = React.useState<number>(1);

  const handleAdd = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error("Please enter a room type name");
      return;
    }

    const newRoom: CreateRoomTypeRequest = {
      name: roomName.trim(),
      roomPrice: roomPrice || 0,
      extraBedPrice: extraBedAvailable ? extraBedPrice || 0 : 0,
      maxAdults: maxAdults || 2,
      maxChildren: maxChildren || 0,
      extraBedAvailable,
      maxExtraBeds: extraBedAvailable ? maxExtraBeds || 1 : 0,
    };

    onAddRoomType(newRoom);

    // Reset fields
    setRoomName("");
    setRoomPrice(100);
    setExtraBedPrice(30);
    setMaxAdults(2);
    setMaxChildren(1);
    setExtraBedAvailable(true);
    setMaxExtraBeds(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-app-fg uppercase tracking-wider flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-app-brand" />
          Hotel Room Types & Pricing
        </h3>
      </div>

      {/* Add Room Type Form Card */}
      <div className="p-4 rounded-2xl bg-app-surface-variant/40 border border-app-border/60 flex flex-col gap-4 text-xs">
        <h4 className="font-bold text-app-fg flex items-center gap-1.5 text-xs">
          <Plus className="w-4 h-4 text-app-brand" />
          Add Room Type to this Hotel
        </h4>

        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1">
            Room Type Name *
          </label>
          <Input
            type="text"
            placeholder="e.g. Deluxe Sea View Suite"
            value={roomName}
            onChange={(e): void => {
              setRoomName(e.target.value);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Room Base Price ($/night) *
            </label>
            <Input
              type="number"
              min={0}
              value={roomPrice}
              onChange={(e): void => {
                setRoomPrice(parseFloat(e.target.value) || 0);
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Extra Bed/Room Price ($/night)
            </label>
            <Input
              type="number"
              min={0}
              disabled={!extraBedAvailable}
              value={extraBedPrice}
              onChange={(e): void => {
                setExtraBedPrice(parseFloat(e.target.value) || 0);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Max Adults *
            </label>
            <Input
              type="number"
              min={1}
              value={maxAdults}
              onChange={(e): void => {
                setMaxAdults(parseInt(e.target.value, 10) || 1);
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Max Children
            </label>
            <Input
              type="number"
              min={0}
              value={maxChildren}
              onChange={(e): void => {
                setMaxChildren(parseInt(e.target.value, 10) || 0);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-app-border/40">
          <label className="flex items-center gap-2 text-xs font-semibold text-app-fg cursor-pointer">
            <input
              type="checkbox"
              checked={extraBedAvailable}
              onChange={(e): void => {
                setExtraBedAvailable(e.target.checked);
              }}
              className="w-4 h-4 rounded text-app-brand focus:ring-app-brand"
            />
            <span>Extra Bed Option Available</span>
          </label>

          {extraBedAvailable && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-app-muted font-medium">Max Extra Beds:</span>
              <Input
                type="number"
                min={1}
                className="w-20 h-8 text-xs"
                value={maxExtraBeds}
                onChange={(e): void => {
                  setMaxExtraBeds(parseInt(e.target.value, 10) || 1);
                }}
              />
            </div>
          )}
        </div>

        <Button type="button" size="sm" onClick={handleAdd} className="self-end gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Room Type
        </Button>
      </div>

      {/* List of Configured Room Types */}
      <div className="flex flex-col gap-2.5 pt-2">
        <span className="text-xs font-bold text-app-fg uppercase tracking-wider">
          Configured Room Types ({roomTypes.length.toString()})
        </span>

        {roomTypes.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-app-border/60 text-xs text-app-muted text-center italic">
            No room types configured for this hotel yet. Use the form above to add room
            types.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roomTypes.map((rt, idx) => (
              <div
                key={`room-${idx.toString()}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-app-brand/40 bg-app-brand/5 text-xs shadow-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-app-fg">{rt.name}</span>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-app-muted">
                    <span className="flex items-center gap-0.5 text-app-brand font-bold">
                      <DollarSign className="w-3 h-3" />
                      Price: ${rt.roomPrice.toString()}/night
                    </span>
                    {rt.extraBedAvailable && (
                      <span>Extra Bed: ${(rt.extraBedPrice ?? 0).toString()}/night</span>
                    )}
                    <span>Max Adults: {rt.maxAdults.toString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(): void => {
                    onRemoveRoomType(idx);
                  }}
                  className="p-1.5 rounded-lg text-app-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Room Type"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
