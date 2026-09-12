import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDoctorsList, type FetchDoctorsParams } from "../api/doctors";

export function useDoctors(params: FetchDoctorsParams) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => fetchDoctorsList(params),
    placeholderData: keepPreviousData,
  });
}
