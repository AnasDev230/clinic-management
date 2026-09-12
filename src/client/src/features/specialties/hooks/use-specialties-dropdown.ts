import { useQuery } from "@tanstack/react-query";
import { fetchSpecialtiesDropdown } from "../api/specialties";

export function useSpecialtiesDropdown() {
  return useQuery({
    queryKey: ["specialties-dropdown"],
    queryFn: fetchSpecialtiesDropdown,
  });
}
