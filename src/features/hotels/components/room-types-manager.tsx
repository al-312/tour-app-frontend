"use client";

import * as React from "react";
import { toast } from "sonner";
import { BedDouble, Trash2, Building2, Search } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import { RoomTypesForm } from "./room-types-form";
import {
  useGetRoomTypesQuery,
  useDeleteIndependentRoomTypeMutation,
} from "../services/hotels-api.slice";

import type { Hotel } from "../types/hotel.types";

interface RoomTypesManagerProps {
  hotels: Hotel[];
}

export function RoomTypesManager({ hotels }: RoomTypesManagerProps): React.JSX.Element {
  const { data: masterRoomTypes = [], isLoading: isRoomTypesLoading } =
    useGetRoomTypesQuery(undefined);

  const [selectedHotelId, setSelectedHotelId] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");

  const [deleteIndependentRoomType] = useDeleteIndependentRoomTypeMutation();

  const filteredRoomTypes = React.useMemo(() => {
    return masterRoomTypes.filter((roomType) => {
      const assignedHotels = hotels.filter((h) =>
        (h.roomTypes ?? []).some((rt) => rt.id === roomType.id)
      );

      const matchesHotel =
        !selectedHotelId ||
        selectedHotelId === "ALL" ||
        assignedHotels.some((h) => h.id === selectedHotelId);

      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        roomType.name.toLowerCase().includes(q) ||
        assignedHotels.some((h) => h.name.toLowerCase().includes(q));

      return matchesHotel && matchesSearch;
    });
  }, [masterRoomTypes, hotels, selectedHotelId, search]);

  const handleDeleteRoomType = async (roomTypeId: string): Promise<void> => {
    try {
      await deleteIndependentRoomType(roomTypeId).unwrap();
      toast.success("Room type deleted from master catalog");
    } catch {
      toast.error("Failed to delete room type");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RoomTypesForm />

      <div className="lg:col-span-2 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row gap-3 justify-between bg-app-surface border border-app-border/80 rounded-2xl p-4 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-app-muted" />
            <Input
              type="text"
              placeholder="Search room types catalog..."
              value={search}
              onChange={(e): void => {
                setSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-app-muted">Assigned Hotel:</span>
            <select
              value={selectedHotelId}
              onChange={(e): void => {
                setSelectedHotelId(e.target.value);
              }}
              className="h-10 px-3 rounded-xl border border-app-border bg-app-surface text-xs text-app-fg focus:outline-none focus:border-app-brand"
            >
              <option value="ALL">All Hotels</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isRoomTypesLoading ? (
          <div className="p-12 text-center text-xs text-app-muted">
            Loading room types catalog...
          </div>
        ) : filteredRoomTypes.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center">
            <BedDouble className="w-8 h-8 text-app-muted mb-2" />
            <h4 className="text-base font-bold text-app-fg">No Room Types Found</h4>
            <p className="text-xs text-app-muted mt-1">
              Create independent room types using the form on the left.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto bg-app-surface border border-app-border/80 rounded-3xl shadow-sm">
            <table className="w-full text-left text-xs text-app-fg border-collapse">
              <thead>
                <tr className="border-b border-app-border/60 bg-app-surface-variant/40 text-app-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-4">Room Type Name</th>
                  <th className="p-4">Assigned Hotels</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Extra Bed Rules</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40">
                {filteredRoomTypes.map((roomType) => {
                  const assignedHotels = hotels.filter((h) =>
                    (h.roomTypes ?? []).some((rt) => rt.id === roomType.id)
                  );

                  return (
                    <tr
                      key={roomType.id}
                      className="hover:bg-app-surface-variant/30 transition-colors"
                    >
                      <td className="p-4 font-bold text-app-fg">{roomType.name}</td>
                      <td className="p-4">
                        {assignedHotels.length === 0 ? (
                          <span className="text-app-muted italic text-[11px]">
                            Unassigned
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {assignedHotels.map((h) => (
                              <span
                                key={h.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-app-brand/10 text-app-brand font-semibold text-[10px]"
                              >
                                <Building2 className="w-3 h-3" />
                                {h.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-app-brand">
                        ${roomType.roomPrice}/night
                      </td>
                      <td className="p-4 text-app-muted">
                        Max {roomType.maxAdults} Adults{" "}
                        {roomType.maxChildren
                          ? `, ${String(roomType.maxChildren)} Child`
                          : ""}
                      </td>
                      <td className="p-4">
                        {roomType.extraBedAvailable ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            +${roomType.extraBedPrice}/night (Max {roomType.maxExtraBeds})
                          </span>
                        ) : (
                          <span className="text-app-muted italic">No extra beds</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(): void => {
                            void handleDeleteRoomType(roomType.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
