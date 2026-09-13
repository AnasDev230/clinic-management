import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreatePaymentRequest,
  PaymentDetail,
  PaymentListItem,
  PaymentMethod,
  PaymentStatus,
} from "@/types/payment";

export interface FetchPaymentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  patientId?: string;
  method?: PaymentMethod;
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchPaymentsList(
  params: FetchPaymentsParams = {},
): Promise<PagedResult<PaymentListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<PaymentListItem>>>(
    "/payments",
    { params },
  );
  return response.data.data;
}

export async function fetchPayment(id: string): Promise<PaymentDetail> {
  const response = await apiClient.get<ApiResponse<PaymentDetail>>(
    `/payments/${id}`,
  );
  return response.data.data;
}

export async function fetchPaymentsByInvoice(
  invoiceId: string,
): Promise<PaymentDetail[]> {
  const response = await apiClient.get<ApiResponse<PaymentDetail[]>>(
    `/payments/invoice/${invoiceId}`,
  );
  return response.data.data;
}

export async function fetchPaymentsByPatient(
  patientId: string,
): Promise<PaymentListItem[]> {
  const response = await apiClient.get<ApiResponse<PaymentListItem[]>>(
    `/payments/patient/${patientId}`,
  );
  return response.data.data;
}

export async function createPayment(
  data: CreatePaymentRequest,
): Promise<PaymentDetail> {
  const response = await apiClient.post<ApiResponse<PaymentDetail>>(
    "/payments",
    data,
  );
  return response.data.data;
}

export async function refundPayment(id: string): Promise<PaymentDetail> {
  const response = await apiClient.put<ApiResponse<PaymentDetail>>(
    `/payments/${id}/refund`,
  );
  return response.data.data;
}
