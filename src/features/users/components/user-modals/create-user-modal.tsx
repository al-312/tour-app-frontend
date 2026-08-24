"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useCreateUserMutation } from "../../services/users-api.slice";
import { createUserSchema, type CreateUserFormData } from "../../schemas/user.schema";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
}: CreateUserModalProps): React.JSX.Element {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CLIENT",
    },
  });

  const onSubmit = async (data: CreateUserFormData): Promise<void> => {
    try {
      await createUser(data).unwrap();
      toast.success(`User ${data.name} created successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create user"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User"
      description="Add a new account to the platform"
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          icon={User}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jane.doe@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />

        <Select
          label="Assigned Role"
          icon={ShieldCheck}
          error={errors.role?.message}
          options={[
            { value: "CLIENT", label: "Client (Standard Traveler)" },
            { value: "CONSULTANT", label: "Consultant (Itinerary Planner)" },
            { value: "ADMIN", label: "Admin (Full Control)" },
          ]}
          {...register("role")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
