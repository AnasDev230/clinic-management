import { useQuery } from "@tanstack/react-query";
import { fetchPatientsGrowth } from "../api/dashboard";

export function usePatientsGrowth(months = 6, enabled = true) {
  return useQuery({
    queryKey: ["dashboard-patients-growth", months],
    queryFn: () => fetchPatientsGrowth(months),
    enabled,
  });
}
