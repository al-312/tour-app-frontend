"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Briefcase, Mail, Phone } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";
import { getMaxPhoneLengthForCountry } from "@/lib/utils/phone.utils";
import { CountryCodeSelect } from "@/components/ui/country-code-select";

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
  });

  const selectedCountryCode = watch("phone.countryCode") ?? "+1";
  const maxPhoneLength = getMaxPhoneLengthForCountry(selectedCountryCode);

  React.useEffect(() => {
    if (consultant) {
      const phoneObj = typeof consultant.phone === "object" ? consultant.phone : null;
      reset({
        firstName: consultant.firstName,
        lastName: consultant.lastName ?? "",
        designation: consultant.designation,
        email: consultant.email ?? "",
        phone: {
          countryCode: phoneObj?.countryCode ?? "+1",
          number: phoneObj?.number ?? phoneObj?.phoneNumber ?? "",
        },
      });
    }
  }, [consultant, reset]);

  if (!consultant) return <></>;

  const fullName =
    consultant.name ??
    [consultant.firstName, consultant.lastName].filter(Boolean).join(" ");

  const onSubmit = async (data: ConsultantFormData): Promise<void> => {
    try {
      await updateConsultant({
        id: consultant.id,
        data: {
          firstName: data.firstName,
          lastName: data.lastName ?? undefined,
          designation: data.designation,
          email: data.email ?? undefined,
          phone:
            data.phone?.countryCode || data.phone?.number || data.phone?.phoneNumber
              ? {
                  countryCode: data.phone.countryCode ?? undefined,
                  number: data.phone.number ?? data.phone.phoneNumber ?? undefined,
                  phoneNumber: data.phone.number ?? data.phone.phoneNumber ?? undefined,
                }
              : undefined,
        },
      }).unwrap();

      toast.success(`Consultant "${data.firstName}" updated successfully!`);
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
      description={`Update profile for ${fullName}`}
    >
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="e.g. Sarah"
            icon={User}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Jenkins"
            icon={User}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <CountryCodeSelect
              label="Country Code"
              value={watch("phone.countryCode") ?? "+1"}
              onChange={(code) => {
                setValue("phone.countryCode", code, { shouldValidate: true });
              }}
              error={errors.phone?.countryCode?.message}
            />
          </div>
          <div className="col-span-3">
            <Input
              label="Phone Number"
              placeholder="555 987 6543"
              maxLength={maxPhoneLength}
              icon={Phone}
              error={errors.phone?.number?.message}
              {...register("phone.number")}
            />
          </div>
        </div>

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
