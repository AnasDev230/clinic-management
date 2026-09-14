import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchNotificationsList,
  type FetchNotificationsParams,
} from "../api/notifications";

export function useNotifications(params: FetchNotificationsParams) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => fetchNotificationsList(params),
    placeholderData: keepPreviousData,
  });
}
