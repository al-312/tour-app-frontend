"use client";

import * as React from "react";
import { Search, Plus, UserCheck, Edit3, Trash2 } from "lucide-react";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";

import type { Client } from "../types/client.types";

interface ClientTableProps {
  clients: Client[];
  onOpenCreate: () => void;
  onOpenEdit: (client: Client) => void;
  onOpenDelete: (client: Client) => void;
}

export function ClientTable({
  clients,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
}: ClientTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.nationality ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

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
            placeholder="Search by name, email, or nationality..."
            className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
          />
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
        </div>

        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Client</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <UserCheck className="w-8 h-8 text-app-muted mb-2" />
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No clients found
          </h4>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Client Name</Table.Head>
              <Table.Head>Contact Info</Table.Head>
              <Table.Head>Nationality</Table.Head>
              <Table.Head>Notes</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((client) => (
              <Table.Row key={client.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-app-brand to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-app-fg text-xs">{client.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-0.5 text-xs">
                    {client.email && (
                      <span className="text-app-fg font-mono">{client.email}</span>
                    )}
                    {client.phone && (
                      <span className="text-app-muted">{client.phone}</span>
                    )}
                    {!client.email && !client.phone && (
                      <span className="text-app-muted italic">—</span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-xs text-app-fg font-medium">
                  {client.nationality ?? "—"}
                </Table.Cell>
                <Table.Cell className="text-xs text-app-muted max-w-xs truncate">
                  {client.notes ?? "—"}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenEdit(client);
                      }}
                      title="Edit Client"
                      className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenDelete(client);
                      }}
                      title="Delete Client"
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
