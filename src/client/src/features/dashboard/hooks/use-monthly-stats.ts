import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyStats } from "../api/dashboard";

export function useMonthlyStats(year: number, month: number, enabled = true) {
  return useQuery({
    queryKey: ["dashboard-monthly", year, month],
    queryFn: () => fetchMonthlyStats(year, month),
    enabled,
  });
}
