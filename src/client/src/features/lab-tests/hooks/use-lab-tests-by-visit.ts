import { useQuery } from "@tanstack/react-query";
import { fetchLabTestsByVisit } from "../api/lab-tests";

export function useLabTestsByVisit(visitId: string) {
  return useQuery({
    queryKey: ["lab-tests", "visit", visitId],
    queryFn: () => fetchLabTestsByVisit(visitId),
    enabled: Boolean(visitId),
  });
}
