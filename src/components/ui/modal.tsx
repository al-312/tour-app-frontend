"use client";

import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string | undefined;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | undefined;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

const emptySubscribe = (): (() => void) => () => undefined;
const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps): React.JSX.Element | null {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop covering full screen including sidebar and header */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in z-[999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog content on top of everything */}
      <div
        className={cn(
          "relative w-full bg-app-surface border border-app-border/80 rounded-2xl shadow-2xl z-[1000] p-6 flex flex-col gap-5 animate-scale-up",
          maxWidthClasses[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-app-border/40 pb-4">
          <div>
            <h3 className="text-lg font-bold text-app-fg font-display-lg">{title}</h3>
            {description && <p className="text-xs text-app-muted mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
