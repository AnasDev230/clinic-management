import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVisitsList, type FetchVisitsParams } from "../api/visits";

export function useVisits(params: FetchVisitsParams) {
  return useQuery({
    queryKey: ["visits", params],
    queryFn: () => fetchVisitsList(params),
    placeholderData: keepPreviousData,
  });
}
