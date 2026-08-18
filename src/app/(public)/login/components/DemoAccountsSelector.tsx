"use client";

import * as React from "react";
import { ShieldCheck, UserCheck, Users } from "lucide-react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

export interface DemoAccount {
  name: string;
  email: string;
  role: "ADMIN" | "CONSULTANT" | "CLIENT";
  userId: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    userId: "fb7b940d-8c61-4d96-8cb8-902f58dede8e",
  },
  {
    name: "Consultant User",
    email: "consultant@example.com",
    role: "CONSULTANT",
    userId: "59b0d7a9-83ff-4ef0-be2e-72e15d92bd4d",
  },
  {
    name: "Client User",
    email: "client@example.com",
    role: "CLIENT",
    userId: "e7bad152-dd68-4a0b-9c96-1dbe1185c1de",
  },
];

export function DemoAccountsSelector({
  onSelect,
}: {
  onSelect: (account: DemoAccount) => void;
}): React.JSX.Element {
  return (
    <div className="border-t border-app-border/60 pt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-app-fg">
        <span className="text-[11px] font-bold tracking-wider uppercase text-app-muted flex items-center gap-1.5 font-label-caps">
          <Users className="w-3.5 h-3.5 text-app-brand" />
          <span>Default Test Credentials</span>
        </span>
        <Badge variant="muted" className="font-mono text-[10px]">
          Password: Password123!
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <Button
            key={acc.userId}
            type="button"
            variant="outline"
            onClick={(): void => {
              onSelect(acc);
            }}
            className="px-3 py-2 rounded-xl border-app-border/60 hover:bg-app-brand-bg hover:border-app-brand/40 transition-all duration-200 text-left flex items-center justify-between cursor-pointer group"
          >
            <span className="text-xs font-bold text-app-fg group-hover:text-app-brand transition-colors">
              {acc.role}
            </span>
            {acc.role === "ADMIN" ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
