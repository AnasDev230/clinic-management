import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyStats } from "../api/dashboard";

export function useWeeklyStats(enabled = true) {
  return useQuery({
    queryKey: ["dashboard-weekly"],
    queryFn: fetchWeeklyStats,
    enabled,
  });
}
