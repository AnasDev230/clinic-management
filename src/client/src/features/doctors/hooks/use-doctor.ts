import { useQuery } from "@tanstack/react-query";
import { fetchDoctor } from "../api/doctors";

export function useDoctor(id: string, enabled = true) {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: () => fetchDoctor(id),
    enabled,
  });
}
