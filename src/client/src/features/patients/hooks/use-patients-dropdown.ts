import { useQuery } from "@tanstack/react-query";
import { fetchPatientsDropdown } from "../api/patients";

export function usePatientsDropdown() {
  return useQuery({
    queryKey: ["patients-dropdown"],
    queryFn: fetchPatientsDropdown,
  });
}
