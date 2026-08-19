"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { User, Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useUpdateUserMutation } from "../../services/users-api.slice";
import { updateUserSchema, type UpdateUserFormData } from "../../schemas/user.schema";

import type { User as UserType, UpdateUserRequest } from "../../types/user.types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
}: EditUserModalProps): React.JSX.Element | null {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: UpdateUserFormData): Promise<void> => {
    try {
      const payload: UpdateUserRequest = {};
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;
      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
      }
      await updateUser({ id: user.id, data: payload }).unwrap();
      toast.success(`User ${user.name} updated successfully!`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update user"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      description={`Updating profile details for ${user.name}`}
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Full Name"
          icon={User}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="New Password (optional)"
          type="password"
          placeholder="Leave blank to keep unchanged"
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
