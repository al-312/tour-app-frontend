import type { DemoAccount } from "../types/auth.types";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "ADMIN", email: "admin@example.com", label: "Admin" },
  { role: "CONSULTANT", email: "consultant@example.com", label: "Consultant" },
  { role: "CLIENT", email: "client@example.com", label: "Client" },
];
