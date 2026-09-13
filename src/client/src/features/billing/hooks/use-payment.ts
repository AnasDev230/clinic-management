import { useQuery } from "@tanstack/react-query";
import { fetchPayment } from "../api/payments";

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => fetchPayment(id),
    enabled: Boolean(id),
  });
}
