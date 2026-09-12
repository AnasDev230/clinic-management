import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchSpecialtiesList,
  type FetchSpecialtiesParams,
} from "../api/specialties";

export function useSpecialties(params: FetchSpecialtiesParams) {
  return useQuery({
    queryKey: ["specialties", params],
    queryFn: () => fetchSpecialtiesList(params),
    placeholderData: keepPreviousData,
  });
}
