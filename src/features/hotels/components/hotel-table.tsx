"use client";

import * as React from "react";
import {
  Search,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Building2,
  Star,
  MapPin,
} from "lucide-react";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";

import type { Hotel } from "../types/hotel.types";
import type { Destination } from "@/features/destinations/types/destination.types";

interface HotelTableProps {
  hotels: Hotel[];
  destinations?: Destination[] | undefined;
  onOpenCreate: () => void;
  onOpenEdit: (hotel: Hotel) => void;
  onOpenDelete: (hotel: Hotel) => void;
  onManageRoomTypes?: (hotel: Hotel) => void;
}

function StarRatingDisplay({ rating }: { rating: number }): React.JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-app-muted/30 fill-app-muted/10"
          }`}
        />
      ))}
      <span className="text-xs font-semibold text-app-fg ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export function HotelTable({
  hotels,
  destinations = [],
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onManageRoomTypes,
}: HotelTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");
  const [destinationFilter, setDestinationFilter] = React.useState<string>("ALL");
  const [ratingFilter, setRatingFilter] = React.useState<string>("ALL");

  const filteredHotels = React.useMemo(() => {
    return hotels.filter((hotel) => {
      const destName = hotel.destination?.name ?? "";
      const destCountry = hotel.destination?.country ?? "";
      const matchesSearch =
        hotel.name.toLowerCase().includes(search.toLowerCase()) ||
        destName.toLowerCase().includes(search.toLowerCase()) ||
        destCountry.toLowerCase().includes(search.toLowerCase());

      const matchesDestination =
        destinationFilter === "ALL" || hotel.destinationId === destinationFilter;

      const matchesRating =
        ratingFilter === "ALL" || hotel.starRating === Number(ratingFilter);

      return matchesSearch && matchesDestination && matchesRating;
    });
  }, [hotels, search, destinationFilter, ratingFilter]);

  return (
    <div className="flex flex-col gap-5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 grow max-w-xl lg:max-w-2xl xl:max-w-3xl">
          {/* Search Bar */}
          <div className="relative grow">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search hotel name or destination..."
              className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 transition-all outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
            />
            <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Destination Filter */}
          <div className="relative shrink-0">
            <select
              value={destinationFilter}
              onChange={(e) => {
                setDestinationFilter(e.target.value);
              }}
              className="w-full sm:w-44 pl-9 pr-8 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm font-semibold text-app-fg outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-app-surface text-app-fg">
                All Destinations
              </option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id} className="bg-app-surface text-app-fg">
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-app-muted absolute left-3 top-3.5 pointer-events-none" />
          </div>

          {/* Rating Filter */}
          <div className="relative shrink-0">
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
              }}
              className="w-full sm:w-36 pl-9 pr-8 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm font-semibold text-app-fg outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-app-surface text-app-fg">
                All Ratings
              </option>
              <option value="5" className="bg-app-surface text-app-fg">
                5 Stars
              </option>
              <option value="4" className="bg-app-surface text-app-fg">
                4 Stars
              </option>
              <option value="3" className="bg-app-surface text-app-fg">
                3 Stars
              </option>
              <option value="2" className="bg-app-surface text-app-fg">
                2 Stars
              </option>
              <option value="1" className="bg-app-surface text-app-fg">
                1 Star
              </option>
            </select>
            <Filter className="w-3.5 h-3.5 text-app-muted absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Create button */}
        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Hotel</span>
        </Button>
      </div>

      {/* Hotels Table */}
      {filteredHotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <div className="w-12 h-12 rounded-full bg-app-surface-variant flex items-center justify-center text-app-muted mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No hotels found
          </h4>
          <p className="text-xs text-app-muted mt-1 max-w-sm">
            {search || destinationFilter !== "ALL" || ratingFilter !== "ALL"
              ? "No hotels match your search or filter criteria. Try resetting filters."
              : "No hotels added yet. Click 'Add New Hotel' to create one."}
          </p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Hotel</Table.Head>
              <Table.Head>Destination</Table.Head>
              <Table.Head>Star Rating</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredHotels.map((hotel) => (
              <Table.Row key={hotel.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-app-brand/10 border border-app-brand/20 flex items-center justify-center text-app-brand shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-app-fg text-xs">{hotel.name}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {hotel.destination ? (
                    <div className="flex items-center gap-1.5 text-xs text-app-fg font-medium">
                      <MapPin className="w-3.5 h-3.5 text-app-brand" />
                      <span>
                        {hotel.destination.name}, {hotel.destination.country}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-app-muted italic">Unassigned</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <StarRatingDisplay rating={hotel.starRating} />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onManageRoomTypes && (
                      <button
                        type="button"
                        onClick={() => {
                          onManageRoomTypes(hotel);
                        }}
                        title="Manage Room Types"
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-app-brand/10 text-app-brand hover:bg-app-brand/20 transition-colors cursor-pointer mr-1"
                      >
                        Room Types ({hotel.roomTypes?.length ?? 0})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenEdit(hotel);
                      }}
                      title="Edit Hotel"
                      className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDelete(hotel);
                      }}
                      title="Delete Hotel"
                      className="p-1.5 rounded-lg text-app-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
