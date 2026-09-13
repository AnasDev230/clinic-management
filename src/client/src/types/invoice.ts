import type { PaymentDetail } from "./payment";

export enum InvoiceStatus {
  Draft = 0,
  Issued = 1,
  PartiallyPaid = 2,
  Paid = 3,
  Overdue = 4,
  Cancelled = 5,
}

export interface InvoiceItemDetail {
  id: string;
  invoiceId: string;
  serviceName: string;
  description?: string | null;
  medicalServiceId?: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalAmount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  visitId?: string | null;
  visitDate?: string | null;
  doctorId?: string | null;
  doctorName: string;
  invoiceDate: string;
  dueDate?: string | null;
  status: InvoiceStatus;
  subTotal: number;
  discountAmount: number;
  discountPercentage: number;
  taxAmount: number;
  taxPercentage: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes?: string | null;
  issuedBy: string;
  issuedAt?: string | null;
  items: InvoiceItemDetail[];
  payments: PaymentDetail[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  patientName: string;
  invoiceDate: string;
  dueDate?: string | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
  overdueAmount: number;
}

export interface CreateInvoiceItemRequest {
  serviceName: string;
  description?: string | null;
  medicalServiceId?: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
}

export interface UpdateInvoiceItemRequest extends CreateInvoiceItemRequest {
  id?: string | null;
}

export interface CreateInvoiceRequest {
  patientId: string;
  visitId?: string | null;
  doctorId?: string | null;
  dueDate?: string | null;
  discountPercentage: number;
  taxPercentage: number;
  notes?: string | null;
  items: CreateInvoiceItemRequest[];
}

export interface UpdateInvoiceRequest {
  dueDate?: string | null;
  discountPercentage: number;
  taxPercentage: number;
  notes?: string | null;
  items: UpdateInvoiceItemRequest[];
}
