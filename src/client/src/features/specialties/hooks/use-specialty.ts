import { useQuery } from "@tanstack/react-query";
import { fetchSpecialty } from "../api/specialties";

export function useSpecialty(id: string) {
  return useQuery({
    queryKey: ["specialties", id],
    queryFn: () => fetchSpecialty(id),
  });
}
