"use client";

import * as React from "react";
import { toast } from "sonner";
import { BedDouble, Plus } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import { useCreateIndependentRoomTypeMutation } from "../services/hotels-api.slice";

export function RoomTypesForm(): React.JSX.Element {
  const [name, setName] = React.useState("Deluxe Suite");
  const [roomPrice, setRoomPrice] = React.useState(200);
  const [maxAdults, setMaxAdults] = React.useState(2);
  const [maxChildren, setMaxChildren] = React.useState(1);
  const [extraBedAvailable, setExtraBedAvailable] = React.useState(true);
  const [extraBedPrice, setExtraBedPrice] = React.useState(50);
  const [maxExtraBeds, setMaxExtraBeds] = React.useState(1);

  const [createIndependentRoomType, { isLoading: isCreating }] =
    useCreateIndependentRoomTypeMutation();

  const handleCreateRoomType = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {
      await createIndependentRoomType({
        name,
        roomPrice,
        maxAdults,
        maxChildren,
        extraBedAvailable,
        extraBedPrice: extraBedAvailable ? extraBedPrice : 0,
        maxExtraBeds: extraBedAvailable ? maxExtraBeds : 0,
      }).unwrap();
      toast.success("Master Room Type created successfully!");
      setName("");
    } catch {
      toast.error("Failed to create room type");
    }
  };

  return (
    <Card className="p-6 border-app-border/80 flex flex-col gap-5 h-fit">
      <div className="flex items-center gap-2 border-b border-app-border/40 pb-3">
        <BedDouble className="w-5 h-5 text-app-brand" />
        <h3 className="text-base font-bold text-app-fg font-display-md">
          Create Room Type
        </h3>
      </div>

      <form
        onSubmit={(e): void => {
          void handleCreateRoomType(e);
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-app-fg mb-1">
            Room Type Name *
          </label>
          <Input
            type="text"
            placeholder="e.g. Executive Ocean View Suite"
            value={name}
            onChange={(e): void => {
              setName(e.target.value);
            }}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Base Price ($/night) *
            </label>
            <Input
              type="number"
              min={0}
              value={roomPrice}
              onChange={(e): void => {
                const val = parseFloat(e.target.value);
                setRoomPrice(Number.isNaN(val) ? 0 : val);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Max Adults *
            </label>
            <Input
              type="number"
              min={1}
              value={maxAdults}
              onChange={(e): void => {
                const val = parseInt(e.target.value, 10);
                setMaxAdults(Number.isNaN(val) ? 1 : val);
              }}
              required
            />
          </div>
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
              const val = parseInt(e.target.value, 10);
              setMaxChildren(Number.isNaN(val) ? 0 : val);
            }}
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-app-surface-variant/40 border border-app-border/60 flex flex-col gap-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-app-fg cursor-pointer">
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
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-app-muted mb-1">
                  Extra Bed Price ($/night)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={extraBedPrice}
                  onChange={(e): void => {
                    const val = parseFloat(e.target.value);
                    setExtraBedPrice(Number.isNaN(val) ? 0 : val);
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] text-app-muted mb-1">
                  Max Extra Beds
                </label>
                <Input
                  type="number"
                  min={1}
                  value={maxExtraBeds}
                  onChange={(e): void => {
                    const val = parseInt(e.target.value, 10);
                    setMaxExtraBeds(Number.isNaN(val) ? 1 : val);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isCreating || !name}
          className="w-full gap-2 mt-1"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? "Saving Room Type..." : "Create Room Type"}</span>
        </Button>
      </form>
    </Card>
  );
}
