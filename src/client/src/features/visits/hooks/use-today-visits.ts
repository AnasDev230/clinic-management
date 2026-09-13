import { useQuery } from "@tanstack/react-query";
import { fetchTodayVisits } from "../api/visits";

export function useTodayVisits() {
  return useQuery({
    queryKey: ["visits-today"],
    queryFn: () => fetchTodayVisits(),
  });
}
