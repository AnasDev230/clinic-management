export enum PrescriptionStatus {
  Active = 0,
  Completed = 1,
  Cancelled = 2,
  Expired = 3,
}

export interface PrescriptionItemDetail {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  quantity?: number | null;
  instructions?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PrescriptionDetail {
  id: string;
  visitId: string;
  visitDate: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  prescriptionDate: string;
  notes?: string | null;
  status: PrescriptionStatus;
  validUntil?: string | null;
  items: PrescriptionItemDetail[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface PrescriptionListItem {
  id: string;
  patientName: string;
  doctorName: string;
  prescriptionDate: string;
  itemCount: number;
  status: PrescriptionStatus;
}

export interface CreatePrescriptionItemRequest {
  medicationName: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  quantity?: number | null;
  instructions?: string | null;
}

export interface UpdatePrescriptionItemRequest extends CreatePrescriptionItemRequest {
  id?: string | null;
}

export interface CreatePrescriptionRequest {
  visitId: string;
  notes?: string | null;
  validUntil?: string | null;
  items: CreatePrescriptionItemRequest[];
}

export interface UpdatePrescriptionRequest {
  notes?: string | null;
  validUntil?: string | null;
  status: PrescriptionStatus;
  items: UpdatePrescriptionItemRequest[];
}
