import { useQuery } from "@tanstack/react-query";
import { fetchRecentActivity } from "../api/dashboard";

export function useRecentActivity(count = 10, enabled = true) {
  return useQuery({
    queryKey: ["dashboard-recent-activity", count],
    queryFn: () => fetchRecentActivity(count),
    enabled,
  });
}
