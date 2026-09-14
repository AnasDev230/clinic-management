import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "../api/dashboard";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchOverview,
    refetchInterval: 60 * 1000,
  });
}
