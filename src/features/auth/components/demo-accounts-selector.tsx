import * as React from "react";
import { UserCheck } from "lucide-react";

import Badge from "@/components/ui/badge";

export interface DemoAccount {
  role: "ADMIN" | "CONSULTANT" | "CLIENT";
  email: string;
  label: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "ADMIN", email: "admin@example.com", label: "Admin" },
  { role: "CONSULTANT", email: "consultant@example.com", label: "Consultant" },
  { role: "CLIENT", email: "client@example.com", label: "Client" },
];

function DemoAccountsSelector({
  onSelect,
}: {
  onSelect: (acc: DemoAccount) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-app-border/40">
      <div className="flex items-center justify-between text-app-muted">
        <span className="text-[10px] font-bold uppercase tracking-wider font-label-caps">
          Quick Demo Login
        </span>
        <UserCheck className="w-3.5 h-3.5 text-app-brand" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <button
            key={acc.role}
            type="button"
            onClick={(): void => {
              onSelect(acc);
            }}
            className="p-2 rounded-xl border border-app-border/60 bg-app-surface-variant/40 hover:bg-app-surface-variant hover:border-app-brand/40 text-left transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <Badge variant="brand" className="text-[9px] px-1.5 py-0 font-bold">
                {acc.label}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-app-muted group-hover:text-app-fg transition-colors truncate block">
              {acc.email}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DemoAccountsSelector;
