export type NotificationType = "inquiry" | "package" | "payment" | "booking" | "system";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  link?: string;
}
