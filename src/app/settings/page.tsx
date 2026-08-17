"use client";

import { z } from "zod";
import { toast } from "sonner";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { List, ListItem } from "@/components/ui/list";

import type { InputProps } from "@/components/ui/input/Input";

const settingsSchema = z.object({
  curatorName: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(30, "Name must be less than 30 characters.")
    .nonempty("Name is required."),
  accessRole: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      curatorName: "Alex Robinson",
      accessRole: "Chief Curator (Premium Tier)",
    },
  });

  const onSubmit = (data: SettingsFormValues): void => {
    toast.success(`Settings saved successfully. Curator: "${data.curatorName}"`);
  };

  const nameInputProps: InputProps = {
    label: "Curator Profile Name",
    error: errors.curatorName?.message,
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <Heading
        level={1}
        variant="display-lg"
        subheading="Configure profile tiers, branding accent tones, and notification rules."
      >
        Settings
      </Heading>

      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="bg-app-surface border border-app-border rounded-2xl p-8 flex flex-col gap-6"
      >
        <h3 className="text-lg font-bold text-app-fg">Security & Tiers</h3>

        <div className="flex flex-col gap-4 max-w-md">
          <Input {...nameInputProps} {...register("curatorName")} />
          <Input label="Access Role" disabled {...register("accessRole")} />
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="mt-2 self-start cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <div className="bg-app-surface border border-app-border rounded-2xl p-8 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-app-fg">Active Session Privileges</h3>
        <List>
          <ListItem>
            <span className="text-sm font-semibold text-app-fg">RTK Query Cache</span>
            <span className="text-xs font-mono text-app-brand font-semibold">Active</span>
          </ListItem>
          <ListItem>
            <span className="text-sm font-semibold text-app-fg">
              Fallow Static Analysis
            </span>
            <span className="text-xs font-mono text-app-brand font-semibold">
              Strict Zero-Suppression
            </span>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
