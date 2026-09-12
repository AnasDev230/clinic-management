import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPatientsList, type FetchPatientsParams } from "../api/patients";

export function usePatients(params: FetchPatientsParams) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => fetchPatientsList(params),
    placeholderData: keepPreviousData,
  });
}
