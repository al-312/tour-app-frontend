"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Briefcase, Mail, Phone, Copy, CheckCircle } from "lucide-react";

import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";
import { getMaxPhoneLengthForCountry } from "@/lib/utils/phone.utils";
import { CountryCodeSelect } from "@/components/ui/country-code-select";

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
  const [createdPassword, setCreatedPassword] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      designation: "",
      email: "",
      phone: { countryCode: "+1", number: "" },
    },
  });

  const selectedCountryCode = watch("phone.countryCode") ?? "+1";
  const maxPhoneLength = getMaxPhoneLengthForCountry(selectedCountryCode);

  const onSubmit = async (data: ConsultantFormData): Promise<void> => {
    try {
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
      const res = await createConsultant({
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
      }).unwrap();

      toast.success(`Consultant "${fullName}" created successfully!`);
      if (res.temporaryPassword) {
        setCreatedPassword(res.temporaryPassword);
      } else {
        reset();
        onClose();
      }
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to create consultant"));
    }
  };

  const handleCopyPassword = (): void => {
    if (createdPassword) {
      void navigator.clipboard.writeText(createdPassword);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleFinishModal = (): void => {
    setCreatedPassword(null);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinishModal}
      title="Add New Consultant"
      description="Register a new travel consultant record"
    >
      {createdPassword ? (
        <div className="flex flex-col gap-4 py-2">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Consultant Account Created!</p>
              <p className="mt-0.5">
                A temporary password has been generated for their first login.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-app-surface border border-app-border/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-app-muted uppercase font-bold tracking-wider block">
                Temporary Password
              </span>
              <span className="text-base font-mono font-bold text-app-brand">
                {createdPassword}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyPassword}
              className="gap-2 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>

          <p className="text-[11px] text-app-muted">
            Share this temporary password with the consultant. They will be forced to
            change it upon logging in.
          </p>

          <div className="flex justify-end pt-3 border-t border-app-border/40">
            <Button type="button" onClick={handleFinishModal}>
              Done
            </Button>
          </div>
        </div>
      ) : (
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
              Create Consultant
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
