"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import Button from "@/components/ui/button";
import { apiTransformer } from "@/lib/api/api-transformer";

interface PageLoadingStateProps {
  label: string;
}

export function PageLoadingState({ label }: PageLoadingStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-app-border/40 bg-app-surface shadow-sm">
      <RefreshCw className="w-8 h-8 text-app-brand animate-spin mb-3" />
      <span className="text-sm font-semibold text-app-fg">{label}</span>
    </div>
  );
}

interface PageErrorStateProps {
  title: string;
  error: unknown;
  defaultMessage: string;
  onRetry: () => void;
}

export function PageErrorState({
  title,
  error,
  defaultMessage,
  onRetry,
}: PageErrorStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 gap-3">
      <AlertCircle className="w-8 h-8 shrink-0" />
      <div>
        <h4 className="text-base font-bold font-display-lg">{title}</h4>
        <p className="text-xs text-rose-600/80 mt-1 max-w-md">
          {apiTransformer.transformError(error, defaultMessage)}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-2 border-rose-500/40 hover:bg-rose-500/20"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        Retry
      </Button>
    </div>
  );
}
