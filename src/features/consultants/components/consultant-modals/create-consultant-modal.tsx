"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Briefcase, Mail, Phone, Image as ImageIcon } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

import { useCreateConsultantMutation } from "../../services/consultants-api.slice";
import {
  consultantSchema,
  type ConsultantFormData,
} from "../../schemas/consultant.schema";

interface CreateConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateConsultantModal({
  isOpen,
  onClose,
}: CreateConsultantModalProps): React.JSX.Element {
  const [createConsultant, { isLoading }] = useCreateConsultantMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: { name: "", designation: "", phone: "", email: "", logo: "" },
  });

  const onSubmit = async (data: ConsultantFormData): Promise<void> => {
    try {
      await createConsultant({
        name: data.name,
        designation: data.designation,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        logo: data.logo ?? undefined,
      }).unwrap();

      toast.success(`Consultant "${data.name}" created successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create consultant"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Consultant"
      description="Register a new travel consultant record"
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Full Name"
          placeholder="e.g. Sarah Jenkins"
          icon={User}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Designation / Title"
          placeholder="e.g. Senior Travel Specialist"
          icon={Briefcase}
          error={errors.designation?.message}
          {...register("designation")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="sarah.j@auratours.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          placeholder="+1 555 987 6543"
          icon={Phone}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Avatar / Logo URL"
          placeholder="https://images.unsplash.com/..."
          icon={ImageIcon}
          error={errors.logo?.message}
          {...register("logo")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-app-border/40">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Consultant
          </Button>
        </div>
      </form>
    </Modal>
  );
}
