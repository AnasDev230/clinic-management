import { useQuery } from "@tanstack/react-query";
import { fetchAttachmentsByEntity } from "../api/attachments";

export function useAttachmentsByEntity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ["attachments", entityType, entityId],
    queryFn: () => fetchAttachmentsByEntity(entityType, entityId),
    enabled: Boolean(entityType && entityId),
  });
}
