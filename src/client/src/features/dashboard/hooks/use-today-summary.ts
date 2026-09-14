import { useQuery } from "@tanstack/react-query";
import { fetchTodaySummary } from "../api/dashboard";

export function useTodaySummary() {
  return useQuery({
    queryKey: ["dashboard-today"],
    queryFn: fetchTodaySummary,
    refetchInterval: 60 * 1000,
  });
}
