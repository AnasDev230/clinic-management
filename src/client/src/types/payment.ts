export enum PaymentMethod {
  Cash = 0,
  CreditCard = 1,
  DebitCard = 2,
  BankTransfer = 3,
  Cheque = 4,
  Insurance = 5,
  Other = 6,
}

export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

export interface PaymentDetail {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  referenceNumber?: string | null;
  notes?: string | null;
  receivedBy: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaymentListItem {
  id: string;
  paymentNumber: string;
  patientName: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  status: PaymentStatus;
}

export interface CreatePaymentRequest {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  notes?: string | null;
}
