"use client";

import * as React from "react";
import { Users, AlertCircle, RefreshCw, ShieldAlert } from "lucide-react";

import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/store/hooks";
import { apiTransformer } from "@/lib/api/api-transformer";
import { UserTable } from "@/features/users/components/user-table";
import { useGetUsersQuery } from "@/features/users/services/users-api.slice";
import { UserStatsCards } from "@/features/users/components/user-stats-cards";
import {
  CreateUserModal,
  EditUserModal,
  ChangeRoleModal,
  DeleteUserModal,
} from "@/features/users/components/user-modals";

import type { User } from "@/features/users/types/user.types";

function DashboardHeader({
  totalUsers = 0,
}: {
  totalUsers?: number | undefined;
}): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Heading level={1} size="2xl">
          User Management
        </Heading>
        <p className="text-app-muted text-sm font-medium mt-1">
          Manage system user accounts, roles, access permissions, and profile details.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-app-surface-variant/80 border border-app-border/60 text-xs font-semibold text-app-fg flex items-center gap-2">
          <Users className="w-4 h-4 text-app-brand" />
          <span>{totalUsers} Total Accounts</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery(undefined);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = React.useState<User | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = React.useState<User | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = React.useState<User | null>(
    null
  );

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader totalUsers={users.length} />

      {/* Stats Cards */}
      <UserStatsCards users={users} />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
          <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
          <span className="text-sm font-semibold text-app-fg">Loading users...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
          <AlertCircle className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">Failed to load users</h4>
            <p className="text-xs text-rose-600/80 mt-1 max-w-md">
              {apiTransformer.transformError(
                error,
                "Unable to connect to backend user service."
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch();
            }}
            className="mt-2 border-rose-500/40 hover:bg-rose-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      ) : currentUser?.role !== "ADMIN" ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-600 gap-3">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-base font-bold font-display-lg">Admin Access Required</h4>
            <p className="text-xs text-amber-600/80 mt-1 max-w-md">
              Full user management features require Administrator privileges. Your account
              role is <strong>{currentUser?.role ?? "GUEST"}</strong>.
            </p>
          </div>
        </div>
      ) : (
        <UserTable
          users={users}
          currentUserId={currentUser.id}
          onOpenCreate={() => {
            setIsCreateOpen(true);
          }}
          onOpenEdit={(u) => {
            setSelectedUserForEdit(u);
          }}
          onOpenChangeRole={(u) => {
            setSelectedUserForRole(u);
          }}
          onOpenDelete={(u) => {
            setSelectedUserForDelete(u);
          }}
        />
      )}

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
        }}
      />

      <EditUserModal
        isOpen={Boolean(selectedUserForEdit)}
        onClose={() => {
          setSelectedUserForEdit(null);
        }}
        user={selectedUserForEdit}
      />

      <ChangeRoleModal
        isOpen={Boolean(selectedUserForRole)}
        onClose={() => {
          setSelectedUserForRole(null);
        }}
        user={selectedUserForRole}
      />

      <DeleteUserModal
        isOpen={Boolean(selectedUserForDelete)}
        onClose={() => {
          setSelectedUserForDelete(null);
        }}
        user={selectedUserForDelete}
      />
    </div>
  );
}
