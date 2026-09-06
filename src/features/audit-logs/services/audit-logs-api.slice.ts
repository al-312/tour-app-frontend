import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  module: string;
  entityType?: string | null;
  entityId?: string | null;
  redactedSummary?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

const auditLogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogItem[], undefined>({
      query: () => ({
        url: "/audit-logs",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<AuditLogItem[]>,
      providesTags: ["AuditLog"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApiSlice;
