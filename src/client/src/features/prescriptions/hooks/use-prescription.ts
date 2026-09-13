import { useQuery } from "@tanstack/react-query";
import { fetchPrescription } from "../api/prescriptions";

export function usePrescription(id: string) {
  return useQuery({
    queryKey: ["prescriptions", id],
    queryFn: () => fetchPrescription(id),
    enabled: Boolean(id),
  });
}
