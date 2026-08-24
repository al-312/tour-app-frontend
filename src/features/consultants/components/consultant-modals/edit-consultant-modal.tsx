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

import { useUpdateConsultantMutation } from "../../services/consultants-api.slice";
import {
  consultantSchema,
  type ConsultantFormData,
} from "../../schemas/consultant.schema";

import type { Consultant } from "../../types/consultant.types";

interface EditConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant | null;
}

export function EditConsultantModal({
  isOpen,
  onClose,
  consultant,
}: EditConsultantModalProps): React.JSX.Element {
  const [updateConsultant, { isLoading }] = useUpdateConsultantMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
  });

  React.useEffect(() => {
    if (consultant) {
      reset({
        name: consultant.name,
        designation: consultant.designation,
        phone: consultant.phone ?? "",
        email: consultant.email ?? "",
        logo: consultant.logo ?? "",
      });
    }
  }, [consultant, reset]);

  if (!consultant) return <></>;

  const onSubmit = async (data: ConsultantFormData): Promise<void> => {
    try {
      await updateConsultant({
        id: consultant.id,
        data: {
          name: data.name,
          designation: data.designation,
          phone: data.phone ?? undefined,
          email: data.email ?? undefined,
          logo: data.logo ?? undefined,
        },
      }).unwrap();

      toast.success(`Consultant "${data.name}" updated successfully!`);
      onClose();
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update consultant"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Consultant"
      description={`Update profile for ${consultant.name}`}
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
