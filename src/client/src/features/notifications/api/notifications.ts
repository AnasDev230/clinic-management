import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  NotificationDetail,
  NotificationItem,
  UnreadCount,
} from "@/types/notification";

export interface FetchNotificationsParams {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}

export async function fetchNotificationsList(
  params: FetchNotificationsParams = {},
): Promise<PagedResult<NotificationItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<NotificationItem>>>(
    "/notifications",
    { params },
  );
  return response.data.data;
}

export async function fetchUnreadCount(): Promise<UnreadCount> {
  const response = await apiClient.get<ApiResponse<UnreadCount>>(
    "/notifications/unread-count",
  );
  return response.data.data;
}

export async function fetchLatestNotifications(
  count = 5,
): Promise<NotificationItem[]> {
  const response = await apiClient.get<ApiResponse<NotificationItem[]>>(
    "/notifications/latest",
    { params: { count } },
  );
  return response.data.data;
}

export async function markNotificationAsRead(
  id: string,
): Promise<NotificationDetail> {
  const response = await apiClient.put<ApiResponse<NotificationDetail>>(
    `/notifications/${id}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.put("/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}
