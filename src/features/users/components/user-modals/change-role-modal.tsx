"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useUpdateUserRoleMutation } from "../../services/users-api.slice";
import {
  updateUserRoleSchema,
  type UpdateUserRoleFormData,
} from "../../schemas/user.schema";

import type { User as UserType } from "../../types/user.types";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function ChangeRoleModal({
  isOpen,
  onClose,
  user,
}: ChangeRoleModalProps): React.JSX.Element | null {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserRoleFormData>({
    resolver: zodResolver(updateUserRoleSchema),
    values: {
      role: user?.role ?? "CLIENT",
    },
  });

  React.useEffect(() => {
    if (user) reset({ role: user.role });
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: UpdateUserRoleFormData): Promise<void> => {
    try {
      await updateUserRole({ id: user.id, role: data.role }).unwrap();
      toast.success(`Role for ${user.name} changed to ${data.role}`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update user role"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Access Role"
      description={`Update role permissions for ${user.name}`}
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Select
          label="Select New Role"
          icon={ShieldCheck}
          error={errors.role?.message}
          options={[
            { value: "CLIENT", label: "Client (Standard Traveler)" },
            { value: "CONSULTANT", label: "Consultant (Itinerary Planner)" },
            { value: "ADMIN", label: "Admin (Full System Access)" },
          ]}
          {...register("role")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Role
          </Button>
        </div>
      </form>
    </Modal>
  );
}
