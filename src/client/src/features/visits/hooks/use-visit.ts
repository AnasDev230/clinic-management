import { useQuery } from "@tanstack/react-query";
import { fetchVisit } from "../api/visits";

export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visits", id],
    queryFn: () => fetchVisit(id),
    enabled: Boolean(id),
  });
}
