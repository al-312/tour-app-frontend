"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck, Mail, Phone, Globe, FileText } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useCreateClientMutation } from "../../services/clients-api.slice";
import { clientSchema, type ClientFormData } from "../../schemas/client.schema";

import type { Client } from "../../types/client.types";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: ((client: Client) => void) | undefined;
}

export function CreateClientModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateClientModalProps): React.JSX.Element {
  const [createClient, { isLoading }] = useCreateClientMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", phone: "", email: "", nationality: "", notes: "" },
  });

  const onSubmit = async (data: ClientFormData): Promise<void> => {
    try {
      const newClient = await createClient({
        name: data.name,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        nationality: data.nationality ?? undefined,
        notes: data.notes ?? undefined,
      }).unwrap();

      toast.success(`Client "${data.name}" created successfully!`);
      reset();
      onSuccess?.(newClient);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create client"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      description="Register a new traveler client record"
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Client Full Name"
          placeholder="e.g. Alice Smith"
          icon={UserCheck}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="alice.smith@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          placeholder="+1 555 123 4567"
          icon={Phone}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Nationality"
          placeholder="e.g. American"
          icon={Globe}
          error={errors.nationality?.message}
          {...register("nationality")}
        />
        <Input
          label="Notes / Preferences"
          placeholder="e.g. Special dietary requirements..."
          icon={FileText}
          error={errors.notes?.message}
          {...register("notes")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Client
          </Button>
        </div>
      </form>
    </Modal>
  );
}
