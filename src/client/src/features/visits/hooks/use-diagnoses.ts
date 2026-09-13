import { useQuery } from "@tanstack/react-query";
import { fetchDiagnoses } from "../api/diagnoses";

export function useDiagnoses(visitId: string) {
  return useQuery({
    queryKey: ["diagnoses", visitId],
    queryFn: () => fetchDiagnoses(visitId),
    enabled: Boolean(visitId),
  });
}
