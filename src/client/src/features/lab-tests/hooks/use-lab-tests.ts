import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchLabTestsList, type FetchLabTestsParams } from "../api/lab-tests";

export function useLabTests(params: FetchLabTestsParams) {
  return useQuery({
    queryKey: ["lab-tests", params],
    queryFn: () => fetchLabTestsList(params),
    placeholderData: keepPreviousData,
  });
}
