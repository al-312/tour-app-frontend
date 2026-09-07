"use client";

import Link from "next/link";
import * as React from "react";
import {
  CheckCheck,
  Trash2,
  MessageSquare,
  Compass,
  CreditCard,
  UserCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { NotificationItem, NotificationType } from "./types/notifications.types";

function getNotificationIcon(type: NotificationType): React.JSX.Element {
  switch (type) {
    case "inquiry":
      return <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case "package":
      return <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    case "payment":
      return <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case "booking":
      return <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case "system":
    default:
      return <CheckCircle2 className="w-4 h-4 text-app-brand" />;
  }
}

function getNotificationBg(type: NotificationType): string {
  switch (type) {
    case "inquiry":
      return "bg-emerald-500/10 dark:bg-emerald-500/20";
    case "package":
      return "bg-sky-500/10 dark:bg-sky-500/20";
    case "payment":
      return "bg-amber-500/10 dark:bg-amber-500/20";
    case "booking":
      return "bg-purple-500/10 dark:bg-purple-500/20";
    case "system":
    default:
      return "bg-app-brand/10 dark:bg-app-brand/20";
  }
}

interface NotificationItemCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function NotificationItemCard({
  notification,
  onClick,
  onToggleRead,
  onDelete,
}: NotificationItemCardProps): React.JSX.Element {
  const iconBg = getNotificationBg(notification.type);

  return (
    <div
      className={cn(
        "p-3.5 transition-colors flex items-start gap-3 relative group cursor-pointer",
        !notification.read
          ? "bg-app-brand-bg/20 hover:bg-app-brand-bg/30"
          : "hover:bg-app-surface-variant/50"
      )}
      onClick={() => {
        onClick(notification);
      }}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105",
          iconBg
        )}
      >
        {getNotificationIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-bold text-app-fg truncate">
            {notification.title}
          </span>
          <span className="text-[10px] text-app-muted shrink-0 font-medium">
            {notification.timestamp}
          </span>
        </div>

        <p className="text-xs text-app-muted line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {notification.link && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-app-brand hover:underline">
            <Link
              href={notification.link}
              onClick={(e) => {
                e.stopPropagation();
                onClick(notification);
              }}
              className="inline-flex items-center gap-1"
            >
              <span>View details</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 self-center">
        {!notification.read && (
          <span
            className="w-2 h-2 rounded-full bg-app-brand shrink-0"
            title="Unread notification"
          />
        )}

        <div className="hidden group-hover:flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              onToggleRead(notification.id, e);
            }}
            title={notification.read ? "Mark as unread" : "Mark as read"}
            className="p-1 rounded-md text-app-muted hover:text-app-fg hover:bg-app-surface transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              onDelete(notification.id, e);
            }}
            title="Delete notification"
            className="p-1 rounded-md text-app-muted hover:text-rose-500 hover:bg-app-surface transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
