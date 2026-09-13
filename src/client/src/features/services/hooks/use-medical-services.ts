import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMedicalServicesList, type FetchMedicalServicesParams } from "../api/medical-services";

export function useMedicalServices(params: FetchMedicalServicesParams) {
  return useQuery({
    queryKey: ["medical-services", params],
    queryFn: () => fetchMedicalServicesList(params),
    placeholderData: keepPreviousData,
  });
}
