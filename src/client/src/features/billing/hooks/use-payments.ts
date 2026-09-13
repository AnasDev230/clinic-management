import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPaymentsList, type FetchPaymentsParams } from "../api/payments";

export function usePayments(params: FetchPaymentsParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => fetchPaymentsList(params),
    placeholderData: keepPreviousData,
  });
}
