import { useQuery } from "@tanstack/react-query";
import { fetchRevenueSummary } from "../api/dashboard";

export function useRevenueSummary(
  year: number,
  month: number,
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard-revenue", year, month],
    queryFn: () => fetchRevenueSummary(year, month),
    enabled,
  });
}
