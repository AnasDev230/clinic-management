import { useQuery } from "@tanstack/react-query";
import { fetchTopDoctors } from "../api/dashboard";

export function useTopDoctors(
  year: number,
  month: number,
  limit = 5,
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard-top-doctors", year, month, limit],
    queryFn: () => fetchTopDoctors(year, month, limit),
    enabled,
  });
}
