import { useQuery } from "@tanstack/react-query";
import { fetchMedicalServicesDropdown } from "../api/medical-services";

export function useMedicalServicesDropdown() {
  return useQuery({
    queryKey: ["medical-services-dropdown"],
    queryFn: () => fetchMedicalServicesDropdown(),
    staleTime: 5 * 60 * 1000,
  });
}
