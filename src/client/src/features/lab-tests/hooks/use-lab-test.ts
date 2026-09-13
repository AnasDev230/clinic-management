import { useQuery } from "@tanstack/react-query";
import { fetchLabTest } from "../api/lab-tests";

export function useLabTest(id: string) {
  return useQuery({
    queryKey: ["lab-tests", id],
    queryFn: () => fetchLabTest(id),
    enabled: Boolean(id),
  });
}
