import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchLabTestsByPatient } from "../api/lab-tests";

export function useLabTestsByPatient(
  patientId: string,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ["lab-tests", "patient", patientId, page, pageSize],
    queryFn: () => fetchLabTestsByPatient(patientId, { page, pageSize }),
    enabled: Boolean(patientId),
    placeholderData: keepPreviousData,
  });
}
