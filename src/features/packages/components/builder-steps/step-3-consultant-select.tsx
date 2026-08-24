"use client";

import * as React from "react";
import { toast } from "sonner";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

import Card from "@/components/ui/card";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";

import { validateStep3Data } from "../../utils/package-builder-validation";

import type { Consultant } from "@/features/consultants/types/consultant.types";

interface Step3ConsultantSelectProps {
  consultantId: string;
  setConsultantId: (id: string) => void;
  consultants: Consultant[];
  onBack: () => void;
  onNext: () => void;
}

export function Step3ConsultantSelect({
  consultantId,
  setConsultantId,
  consultants,
  onBack,
  onNext,
}: Step3ConsultantSelectProps): React.JSX.Element {
  const [touched, setTouched] = React.useState(false);

  const validation = validateStep3Data(consultantId);
  const selectedConsultant = consultants.find((c) => c.id === consultantId);

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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Assign Travel Consultant</h2>
          <p className="text-xs text-muted-foreground">
            Select the travel consultant managing this package offer and proposal
            branding.
          </p>
        </div>

        <Select
          label="Travel Consultant *"
          value={consultantId}
          error={touched && !validation.isValid ? validation.error : undefined}
          onChange={(e) => {
            setConsultantId(e.target.value);
          }}
          icon={Briefcase}
        >
          <option value="">Select a consultant...</option>
          {consultants.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.designation})
            </option>
          ))}
        </Select>

        {selectedConsultant ? (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Assigned Consultant Details
            </div>
            <div className="text-sm font-bold text-foreground">
              {selectedConsultant.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedConsultant.designation}
            </div>
            <div className="text-xs text-muted-foreground flex gap-4 pt-1">
              {selectedConsultant.email ? (
                <span>✉️ {selectedConsultant.email}</span>
              ) : null}
              {selectedConsultant.phone ? (
                <span>📞 {selectedConsultant.phone}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNextStep} className="gap-2">
            Next: Proposal Preview & Export
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
