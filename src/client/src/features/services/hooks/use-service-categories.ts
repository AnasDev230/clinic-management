import { useQuery } from "@tanstack/react-query";
import { fetchServiceCategories } from "../api/service-categories";

export function useServiceCategories(isActive?: boolean) {
  return useQuery({
    queryKey: ["service-categories", isActive],
    queryFn: () => fetchServiceCategories(isActive),
  });
}
