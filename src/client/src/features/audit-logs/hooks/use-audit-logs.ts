import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAuditLogsList, type FetchAuditLogsParams } from "../api/audit-logs";

export function useAuditLogs(params: FetchAuditLogsParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => fetchAuditLogsList(params),
    placeholderData: keepPreviousData,
  });
}
