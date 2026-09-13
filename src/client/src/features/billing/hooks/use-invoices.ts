import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchInvoicesList, type FetchInvoicesParams } from "../api/invoices";

export function useInvoices(params: FetchInvoicesParams) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => fetchInvoicesList(params),
    placeholderData: keepPreviousData,
  });
}
