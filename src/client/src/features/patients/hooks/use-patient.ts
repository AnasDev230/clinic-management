import { useQuery } from "@tanstack/react-query";
import { fetchPatient } from "../api/patients";

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => fetchPatient(id),
  });
}
