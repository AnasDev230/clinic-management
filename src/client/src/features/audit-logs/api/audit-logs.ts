import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  AuditAction,
  AuditLogDetail,
  AuditLogListItem,
} from "@/types/audit-log";

export interface FetchAuditLogsParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAuditLogsList(
  params: FetchAuditLogsParams = {},
): Promise<PagedResult<AuditLogListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<AuditLogListItem>>>(
    "/audit-logs",
    { params },
  );
  return response.data.data;
}

export async function fetchAuditLog(id: string): Promise<AuditLogDetail> {
  const response = await apiClient.get<ApiResponse<AuditLogDetail>>(
    `/audit-logs/${id}`,
  );
  return response.data.data;
}

export async function fetchAuditLogsByEntity(
  entityType: string,
  entityId: string,
): Promise<AuditLogDetail[]> {
  const response = await apiClient.get<ApiResponse<AuditLogDetail[]>>(
    `/audit-logs/entity/${entityType}/${entityId}`,
  );
  return response.data.data;
}
