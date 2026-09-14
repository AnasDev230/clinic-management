import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogsByEntity } from "../api/audit-logs";

export function useAuditLogsByEntity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ["audit-logs", "entity", entityType, entityId],
    queryFn: () => fetchAuditLogsByEntity(entityType, entityId),
    enabled: Boolean(entityType && entityId),
  });
}
