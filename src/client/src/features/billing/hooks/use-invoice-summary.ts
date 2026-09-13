import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceSummary } from "../api/invoices";

export function useInvoiceSummary() {
  return useQuery({
    queryKey: ["invoice-summary"],
    queryFn: fetchInvoiceSummary,
  });
}
