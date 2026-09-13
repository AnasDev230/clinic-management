import { useQuery } from "@tanstack/react-query";
import { fetchVitals } from "../api/vitals";

export function useVitals(visitId: string) {
  return useQuery({
    queryKey: ["vitals", visitId],
    queryFn: () => fetchVitals(visitId),
    enabled: Boolean(visitId),
  });
}
