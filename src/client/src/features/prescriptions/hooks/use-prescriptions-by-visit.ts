import { useQuery } from "@tanstack/react-query";
import { fetchPrescriptionsByVisit } from "../api/prescriptions";

export function usePrescriptionsByVisit(visitId: string) {
  return useQuery({
    queryKey: ["prescriptions", "visit", visitId],
    queryFn: () => fetchPrescriptionsByVisit(visitId),
    enabled: Boolean(visitId),
  });
}
