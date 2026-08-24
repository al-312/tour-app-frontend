"use client";

import * as React from "react";
import { Search, Edit3, Shield, Trash2, Plus, Filter, UserX } from "lucide-react";

import Table from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

import type { User as UserType, UserRole } from "../types/user.types";

interface UserTableProps {
  users: UserType[];
  onOpenCreate: () => void;
  onOpenEdit: (user: UserType) => void;
  onOpenChangeRole: (user: UserType) => void;
  onOpenDelete: (user: UserType) => void;
  currentUserId?: string | undefined;
}

function RoleBadge({ role }: { role: UserRole }): React.JSX.Element {
  switch (role) {
    case "ADMIN":
      return <Badge variant="rose">Admin</Badge>;
    case "CONSULTANT":
      return <Badge variant="amber">Consultant</Badge>;
    case "CLIENT":
      return <Badge variant="emerald">Client</Badge>;
    default:
      return <Badge variant="muted">{role}</Badge>;
  }
}

export function UserTable({
  users,
  onOpenCreate,
  onOpenEdit,
  onOpenChangeRole,
  onOpenDelete,
  currentUserId,
}: UserTableProps): React.JSX.Element {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 grow max-w-xl lg:max-w-2xl xl:max-w-3xl">
          {/* Search bar */}
          <div className="relative grow">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm text-app-fg placeholder:text-app-muted/60 transition-all outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20"
            />
            <Search className="w-4 h-4 text-app-muted absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Filter dropdown */}
          <div className="relative shrink-0">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
              }}
              className="w-full sm:w-40 pl-9 pr-8 py-2.5 bg-app-surface-variant/80 border border-app-border/80 rounded-xl text-xs sm:text-sm font-semibold text-app-fg outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-app-surface text-app-fg">
                All Roles
              </option>
              <option value="ADMIN" className="bg-app-surface text-app-fg">
                Admins
              </option>
              <option value="CONSULTANT" className="bg-app-surface text-app-fg">
                Consultants
              </option>
              <option value="CLIENT" className="bg-app-surface text-app-fg">
                Clients
              </option>
            </select>
            <Filter className="w-3.5 h-3.5 text-app-muted absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Create button */}
        <Button onClick={onOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New User</span>
        </Button>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-app-border/60 bg-app-surface-variant/20">
          <div className="w-12 h-12 rounded-full bg-app-surface-variant flex items-center justify-center text-app-muted mb-3">
            <UserX className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-app-fg font-display-lg">
            No users found
          </h4>
          <p className="text-xs text-app-muted mt-1 max-w-sm">
            {search || roleFilter !== "ALL"
              ? "No user accounts match your search or filter criteria. Try clearing filters."
              : "No user accounts registered yet. Click 'Add New User' to create one."}
          </p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Joined Date</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredUsers.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-app-brand to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-app-brand/20">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-app-fg text-xs flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isCurrentUser && (
                            <Badge variant="muted" className="text-[10px] py-0 px-1.5">
                              You
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-app-muted font-mono">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    <RoleBadge role={user.role} />
                  </Table.Cell>
                  <Table.Cell className="text-xs text-app-muted">
                    {formatDate(user.createdAt)}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenEdit(user);
                        }}
                        title="Edit User Details"
                        className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenChangeRole(user);
                        }}
                        title="Change Role"
                        className="p-1.5 rounded-lg text-app-muted hover:text-app-brand hover:bg-app-brand/10 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenDelete(user);
                        }}
                        disabled={isCurrentUser}
                        title={
                          isCurrentUser ? "Cannot delete your own account" : "Delete User"
                        }
                        className="p-1.5 rounded-lg text-app-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
