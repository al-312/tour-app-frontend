"use client";

import * as React from "react";
import { Search, Plus, MapPin, Edit3, Trash2 } from "lucide-react";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";

import type { Destination } from "../types/destination.types";

interface DestinationTableProps {
  destinations: Destination[];
  onOpenCreate: () => void;
  onOpenEdit: (destination: Destination) => void;
  onOpenDelete: (destination: Destination) => void;
}

export function DestinationTable({
  destinations,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
}: DestinationTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase())
    );
  }, [destinations, search]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative grow max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search by city or country..."
            className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
          />
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
        </div>

        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Location</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <div className="w-12 h-12 rounded-full bg-app-surface-variant flex items-center justify-center text-app-muted mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No locations found
          </h4>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Location / City</Table.Head>
              <Table.Head>Country</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((dest) => (
              <Table.Row key={dest.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-app-brand/10 border border-app-brand/20 flex items-center justify-center text-app-brand shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-app-fg text-xs">{dest.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-xs text-app-fg font-medium">
                  {dest.country}
                </Table.Cell>
                <Table.Cell className="text-xs text-app-muted max-w-xs truncate">
                  {dest.description ?? "—"}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenEdit(dest);
                      }}
                      title="Edit Location"
                      className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDelete(dest);
                      }}
                      title="Delete Location"
                      className="p-1.5 rounded-lg text-app-muted hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
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
