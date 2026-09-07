import type { NotificationItem } from "../types/notifications.types";

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Inquiry Received",
    message: "Sarah Jenkins submitted a new inquiry for Bali Luxury Beach Resort.",
    timestamp: "10 mins ago",
    read: false,
    type: "inquiry",
    link: "/inquiries",
  },
  {
    id: "notif-2",
    title: "Customization Request",
    message: "Michael Scott requested custom hotel upgrades for Tokyo Tour.",
    timestamp: "45 mins ago",
    read: false,
    type: "package",
    link: "/packages",
  },
  {
    id: "notif-3",
    title: "Payment Confirmed",
    message: "Received payment of $3,200 for Swiss Alps Adventure package.",
    timestamp: "2 hours ago",
    read: false,
    type: "payment",
    link: "/inquiries",
  },
  {
    id: "notif-4",
    title: "Consultant Assigned",
    message: "Emma Watson was assigned to manage Client Request #INQ-8821.",
    timestamp: "1 day ago",
    read: true,
    type: "booking",
    link: "/consultants",
  },
  {
    id: "notif-5",
    title: "System Update",
    message: "Tour catalog synchronization completed successfully.",
    timestamp: "2 days ago",
    read: true,
    type: "system",
  },
];
