import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPrescriptionsByPatient } from "../api/prescriptions";

export function usePrescriptionsByPatient(
  patientId: string,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ["prescriptions", "patient", patientId, page, pageSize],
    queryFn: () => fetchPrescriptionsByPatient(patientId, { page, pageSize }),
    enabled: Boolean(patientId),
    placeholderData: keepPreviousData,
  });
}
