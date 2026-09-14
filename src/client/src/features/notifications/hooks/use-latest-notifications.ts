import { useQuery } from "@tanstack/react-query";
import { fetchLatestNotifications } from "../api/notifications";

export function useLatestNotifications(count = 5) {
  return useQuery({
    queryKey: ["notifications-latest", count],
    queryFn: () => fetchLatestNotifications(count),
    refetchInterval: 60 * 1000,
  });
}
