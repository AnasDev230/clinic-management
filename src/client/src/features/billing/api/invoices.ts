import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreateInvoiceRequest,
  InvoiceDetail,
  InvoiceListItem,
  InvoiceStatus,
  InvoiceSummary,
  UpdateInvoiceRequest,
} from "@/types/invoice";

export interface FetchInvoicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  patientId?: string;
  doctorId?: string;
  status?: InvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchInvoicesList(
  params: FetchInvoicesParams = {},
): Promise<PagedResult<InvoiceListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<InvoiceListItem>>>(
    "/invoices",
    { params },
  );
  return response.data.data;
}

export async function fetchInvoice(id: string): Promise<InvoiceDetail> {
  const response = await apiClient.get<ApiResponse<InvoiceDetail>>(
    `/invoices/${id}`,
  );
  return response.data.data;
}

export async function fetchInvoiceByNumber(
  invoiceNumber: string,
): Promise<InvoiceDetail> {
  const response = await apiClient.get<ApiResponse<InvoiceDetail>>(
    `/invoices/number/${invoiceNumber}`,
  );
  return response.data.data;
}

export async function fetchInvoicesByPatient(
  patientId: string,
): Promise<InvoiceListItem[]> {
  const response = await apiClient.get<ApiResponse<InvoiceListItem[]>>(
    `/invoices/patient/${patientId}`,
  );
  return response.data.data;
}

export async function fetchInvoiceSummary(): Promise<InvoiceSummary> {
  const response = await apiClient.get<ApiResponse<InvoiceSummary>>(
    "/invoices/summary",
  );
  return response.data.data;
}

export async function createInvoice(
  data: CreateInvoiceRequest,
): Promise<InvoiceDetail> {
  const response = await apiClient.post<ApiResponse<InvoiceDetail>>(
    "/invoices",
    data,
  );
  return response.data.data;
}

export async function updateInvoice(
  id: string,
  data: UpdateInvoiceRequest,
): Promise<InvoiceDetail> {
  const response = await apiClient.put<ApiResponse<InvoiceDetail>>(
    `/invoices/${id}`,
    data,
  );
  return response.data.data;
}

export async function issueInvoice(id: string): Promise<InvoiceDetail> {
  const response = await apiClient.put<ApiResponse<InvoiceDetail>>(
    `/invoices/${id}/issue`,
  );
  return response.data.data;
}

export async function cancelInvoice(id: string): Promise<InvoiceDetail> {
  const response = await apiClient.put<ApiResponse<InvoiceDetail>>(
    `/invoices/${id}/cancel`,
  );
  return response.data.data;
}

export async function deleteInvoice(id: string): Promise<void> {
  await apiClient.delete(`/invoices/${id}`);
}
