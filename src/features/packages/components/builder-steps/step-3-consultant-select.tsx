"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users as UsersIcon,
} from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

import { validateStep3Data } from "../../utils/package-builder-validation";

interface Step3ConsultantSelectProps {
  consultantId?: string;
  setConsultantId?: (id: string) => void;
  adults: number;
  setAdults: (val: number) => void;
  childrenCount: number;
  setChildrenCount: (val: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3ConsultantSelect({
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  onBack,
  onNext,
}: Step3ConsultantSelectProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const validation = validateStep3Data({ adults });

  const handleNextStep = (): void => {
    setTouched(true);
    if (!validation.isValid) {
      if (validation.error) {
        toast.error(validation.error);
      }
      return;
    }
    onNext();
  };

  const userDisplayName = user?.name ?? user?.email ?? "Current User";

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Traveler Details & Package User
          </h2>
          <p className="text-xs text-muted-foreground">
            Specify adult and child traveler counts for this tour package proposal.
          </p>
        </div>

        {/* User Info Card (Automatic, no selection dropdown) */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <UserIcon className="w-4 h-4" />
            Package User (Created By)
          </div>
          <div className="text-sm font-bold text-foreground">{userDisplayName}</div>
          <div className="text-xs text-muted-foreground">
            Role: {user?.role ?? "USER"} {user?.email ? `• ${user.email}` : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Adult Travelers *"
            type="number"
            min={1}
            value={adults === 0 ? "" : adults}
            error={
              touched && adults < 1 ? "Adult travelers must be at least 1" : undefined
            }
            onChange={(e) => {
              const raw = e.target.value;
              setAdults(raw === "" ? 0 : parseInt(raw, 10) || 0);
            }}
            icon={UsersIcon}
          />

          <Input
            label="Child Travelers"
            type="number"
            min={0}
            value={childrenCount === 0 ? "" : childrenCount}
            onChange={(e) => {
              const raw = e.target.value;
              setChildrenCount(raw === "" ? 0 : parseInt(raw, 10) || 0);
            }}
          />
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNextStep} className="gap-2">
            Next: Preview & Save
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
