"use client";

import * as React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  title: string;
  sub: string;
}

export const ADMIN_STEPS: StepItem[] = [
  { id: 1, title: "Basic Info", sub: "Package & Details" },
  { id: 2, title: "Daily Itinerary", sub: "Hotel Stay" },
  { id: 3, title: "Preview & Save", sub: "Master Template" },
];

export const CONSULTANT_STEPS: StepItem[] = [
  { id: 1, title: "Basic Info", sub: "Package & Client" },
  { id: 2, title: "Daily Itinerary", sub: "Hotel Stay" },
  { id: 3, title: "Select Consultant", sub: "Assign Consultant" },
  { id: 4, title: "Preview Proposal", sub: "Review & Save" },
];

interface StepIndicatorProps {
  currentStep: number;
  steps?: StepItem[] | undefined;
  onStepClick: (stepId: number) => void;
}

export function StepIndicator({
  currentStep,
  steps = CONSULTANT_STEPS,
  onStepClick,
}: StepIndicatorProps): React.JSX.Element {
  const colsClass = steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 ${colsClass} gap-4`}>
      {steps.map((s) => {
        const isActive = currentStep === s.id;
        const isPassed = currentStep > s.id;

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              onStepClick(s.id);
            }}
            className={`p-4 rounded-xl border text-left transition-all ${
              isActive
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                : isPassed
                  ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                  : "border-border bg-card hover:bg-muted/40 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isPassed
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isPassed ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? "text-primary"
                      : isPassed
                        ? "text-emerald-700"
                        : "text-muted-foreground"
                  }`}
                >
                  Step {String(s.id)}
                </div>
                <div className="text-sm font-semibold text-foreground">{s.title}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
