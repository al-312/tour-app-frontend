"use client";

import * as React from "react";
import { ShieldCheck, Search, Lock } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { useGetAuditLogsQuery } from "@/features/audit-logs/services/audit-logs-api.slice";

export default function AuditLogsPage(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const { data: logs = [], isLoading } = useGetAuditLogsQuery(undefined, {
    skip: !isSuperAdmin,
  });

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredLogs = React.useMemo(() => {
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        (log.redactedSummary?.toLowerCase().includes(q) ?? false) ||
        (log.actorRole?.toLowerCase().includes(q) ?? false)
    );
  }, [logs, searchQuery]);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-app-fg font-display-md">
          Access Restricted
        </h2>
        <p className="text-xs text-app-muted max-w-md mt-1">
          Audit logs are encrypted at rest and accessible strictly by Super Admin
          accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-app-brand/10 text-app-brand text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Security Module
          </div>
          <h1 className="text-2xl font-extrabold text-app-fg tracking-tight font-display-lg">
            System Audit Logs
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Encrypted and redacted audit records of all sensitive administrative actions.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-app-surface border border-app-border/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-app-muted" />
          <Input
            type="text"
            placeholder="Search by action, module, or summary..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <Badge variant="brand">{logs.length} Total Logs</Badge>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-3xl bg-app-surface border border-app-border animate-pulse" />
      ) : filteredLogs.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-app-muted mb-2" />
          <h3 className="text-base font-bold text-app-fg">No Audit Logs Found</h3>
          <p className="text-xs text-app-muted mt-1">
            No system action events match your filter query.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-app-surface border border-app-border/80 rounded-3xl shadow-sm">
          <table className="w-full text-left text-xs text-app-fg border-collapse">
            <thead>
              <tr className="border-b border-app-border/60 bg-app-surface-variant/40 text-app-muted uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module</th>
                <th className="p-4">Redacted Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-app-surface-variant/30 transition-colors"
                >
                  <td className="p-4 text-app-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Badge variant="muted">{log.actorRole ?? "SYSTEM"}</Badge>
                  </td>
                  <td className="p-4 font-bold text-app-brand">{log.action}</td>
                  <td className="p-4 font-semibold">{log.module}</td>
                  <td className="p-4 max-w-md text-app-muted font-mono text-[11px] leading-relaxed">
                    {log.redactedSummary ?? "Action recorded"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
