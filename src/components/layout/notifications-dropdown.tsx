"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { Bell, CheckCheck, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { NotificationItemCard } from "./notification-item-card";
import { SAMPLE_NOTIFICATIONS } from "./constants/notifications.constants";

import type { NotificationItem } from "./types/notifications.types";

export function NotificationsDropdown(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = (): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleToggleRead = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const handleClearAll = (): void => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const handleNotificationClick = (notification: NotificationItem): void => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }
    setIsOpen(false);
  };

  const ariaLabelText = `Notifications${unreadCount > 0 ? `, ${String(unreadCount)} unread` : ""}`;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={ariaLabelText}
        className="p-2.5 rounded-xl text-app-muted hover:text-app-fg hover:bg-app-surface-variant transition-colors cursor-pointer relative group"
      >
        <Bell className="w-4 h-4 group-hover:scale-105 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-app-brand px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-app-surface leading-none">
            {unreadCount > 99 ? "99+" : String(unreadCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-app-surface border border-app-border/80 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
          <div className="p-4 border-b border-app-border/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-app-fg tracking-tight">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-app-brand/10 text-app-brand border border-app-brand/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-app-muted hover:text-app-brand hover:bg-app-surface-variant rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    Mark read
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="p-1.5 text-app-muted hover:text-app-fg hover:bg-app-surface-variant rounded-lg transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-app-border/40 bg-app-surface-variant/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium text-xs transition-colors cursor-pointer",
                  filter === "all"
                    ? "bg-app-surface text-app-fg shadow-xs font-semibold"
                    : "text-app-muted hover:text-app-fg"
                )}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter("unread");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium text-xs transition-colors cursor-pointer",
                  filter === "unread"
                    ? "bg-app-surface text-app-fg shadow-xs font-semibold"
                    : "text-app-muted hover:text-app-fg"
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-medium text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="overflow-y-auto divide-y divide-app-border/30 max-h-[380px]">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <Bell className="w-8 h-8 text-app-muted/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-app-fg">No notifications</p>
                <p className="text-[11px] text-app-muted mt-0.5">
                  {filter === "unread"
                    ? "You have read all your notifications."
                    : "Your notification center is empty."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItemCard
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-app-border/40 bg-app-surface-variant/20 text-center">
              <Link
                href="/inquiries"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="text-xs font-semibold text-app-brand hover:text-app-brand-hover transition-colors inline-block"
              >
                View all activity
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
