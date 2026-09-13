import { useQuery } from "@tanstack/react-query";
import { fetchPaymentsByInvoice } from "../api/payments";

export function usePaymentsByInvoice(invoiceId: string) {
  return useQuery({
    queryKey: ["payments", "invoice", invoiceId],
    queryFn: () => fetchPaymentsByInvoice(invoiceId),
    enabled: Boolean(invoiceId),
  });
}
