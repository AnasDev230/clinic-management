import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPrescriptionsList, type FetchPrescriptionsParams } from "../api/prescriptions";

export function usePrescriptions(params: FetchPrescriptionsParams) {
  return useQuery({
    queryKey: ["prescriptions", params],
    queryFn: () => fetchPrescriptionsList(params),
    placeholderData: keepPreviousData,
  });
}
