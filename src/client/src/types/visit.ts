export enum VisitStatus {
  Waiting = 0,
  InConsultation = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface DiagnosisItem {
  id: string;
  visitId: string;
  code?: string | null;
  name: string;
  description?: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface VitalsDetail {
  id: string;
  visitId: string;
  temperature?: number | null;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  weight?: number | null;
  height?: number | null;
  bmi?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface VisitDetail {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  chiefComplaint?: string | null;
  symptoms?: string | null;
  diagnosis?: string | null;
  treatmentPlan?: string | null;
  notes?: string | null;
  status: VisitStatus;
  nextVisitRecommended: boolean;
  nextVisitNotes?: string | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  diagnoses: DiagnosisItem[];
  vitals?: VitalsDetail | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface VisitListItem {
  id: string;
  patientName: string;
  doctorName: string;
  visitDate: string;
  status: VisitStatus;
  totalAmount: number;
}

export interface CreateVisitRequest {
  appointmentId: string;
  chiefComplaint?: string | null;
  symptoms?: string | null;
  notes?: string | null;
}

export interface UpdateVisitRequest {
  chiefComplaint?: string | null;
  symptoms?: string | null;
  diagnosis?: string | null;
  treatmentPlan?: string | null;
  notes?: string | null;
  nextVisitRecommended: boolean;
  nextVisitNotes?: string | null;
  totalAmount: number;
  discountAmount: number;
}

export interface CreateDiagnosisRequest {
  code?: string | null;
  name: string;
  description?: string | null;
  isPrimary: boolean;
}

export interface UpdateDiagnosisRequest extends CreateDiagnosisRequest {}

export interface CreateVitalsRequest {
  temperature?: number | null;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  weight?: number | null;
  height?: number | null;
  notes?: string | null;
}

export interface UpdateVitalsRequest extends CreateVitalsRequest {}
