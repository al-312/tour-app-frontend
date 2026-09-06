"use client";

import * as React from "react";
import { Search, Plus, Briefcase, Edit3, Trash2 } from "lucide-react";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";

import type { Consultant } from "../types/consultant.types";

interface ConsultantTableProps {
  consultants: Consultant[];
  onOpenCreate: () => void;
  onOpenEdit: (consultant: Consultant) => void;
  onOpenDelete: (consultant: Consultant) => void;
}

export function ConsultantTable({
  consultants,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
}: ConsultantTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return consultants.filter((c) => {
      const fullName = c.name ?? [c.firstName, c.lastName].filter(Boolean).join(" ");
      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.designation.toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [consultants, search]);

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
            placeholder="Search consultant by name or designation..."
            className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
          />
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
        </div>

        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Consultant</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <Briefcase className="w-8 h-8 text-app-muted mb-2" />
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No consultants found
          </h4>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Consultant</Table.Head>
              <Table.Head>Designation</Table.Head>
              <Table.Head>Contact Info</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((consultant) => {
              const fullName =
                consultant.name ??
                [consultant.firstName, consultant.lastName].filter(Boolean).join(" ");
              const phoneObj =
                typeof consultant.phone === "object" ? consultant.phone : null;
              const phoneStr = phoneObj
                ? [phoneObj.countryCode, phoneObj.number ?? phoneObj.phoneNumber]
                    .filter(Boolean)
                    .join(" ")
                : typeof consultant.phone === "string"
                  ? consultant.phone
                  : "";

              return (
                <Table.Row key={consultant.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-app-fg text-xs">{fullName}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-app-fg font-medium">
                    {consultant.designation}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      {consultant.email && (
                        <span className="text-app-fg font-mono">{consultant.email}</span>
                      )}
                      {phoneStr ? (
                        <span className="text-app-muted">{phoneStr}</span>
                      ) : null}
                      {!consultant.email && !phoneStr && (
                        <span className="text-app-muted italic">—</span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenEdit(consultant);
                        }}
                        title="Edit Consultant"
                        className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenDelete(consultant);
                        }}
                        title="Delete Consultant"
                        className="p-1.5 rounded-lg text-app-muted hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
