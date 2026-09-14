import { useQuery } from "@tanstack/react-query";
import { fetchAuditLog } from "../api/audit-logs";

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => fetchAuditLog(id),
    enabled: Boolean(id),
  });
}
