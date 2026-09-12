export enum Gender {
  Male = 0,
  Female = 1,
}

export enum MedicalHistoryStatus {
  Active = 0,
  Resolved = 1,
  Chronic = 2,
}

export enum AllergyType {
  Drug = 0,
  Food = 1,
  Environmental = 2,
  Other = 3,
}

export enum AllergySeverity {
  Mild = 0,
  Moderate = 1,
  Severe = 2,
}

export interface MedicalHistoryItem {
  id: string;
  patientId: string;
  title: string;
  description?: string | null;
  diagnosedDate?: string | null;
  status: MedicalHistoryStatus;
}

export interface CreateMedicalHistoryRequest {
  title: string;
  description?: string | null;
  diagnosedDate?: string | null;
  status: MedicalHistoryStatus;
}

export interface UpdateMedicalHistoryRequest
  extends CreateMedicalHistoryRequest {}

export interface AllergyItem {
  id: string;
  patientId: string;
  name: string;
  type: AllergyType;
  severity: AllergySeverity;
  notes?: string | null;
}

export interface CreateAllergyRequest {
  name: string;
  type: AllergyType;
  severity: AllergySeverity;
  notes?: string | null;
}

export interface UpdateAllergyRequest extends CreateAllergyRequest {}

export interface InsuranceDetail {
  id: string;
  patientId: string;
  providerName: string;
  policyNumber: string;
  groupNumber?: string | null;
  expiryDate: string;
  coveragePercentage: number;
  isActive: boolean;
}

export interface CreateInsuranceRequest {
  providerName: string;
  policyNumber: string;
  groupNumber?: string | null;
  expiryDate: string;
  coveragePercentage: number;
  isActive: boolean;
}

export interface UpdateInsuranceRequest extends CreateInsuranceRequest {}

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  nationalId?: string | null;
  bloodType?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
  isActive: boolean;
  medicalHistories: MedicalHistoryItem[];
  allergies: AllergyItem[];
  insurance?: InsuranceDetail | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PatientListItem {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  isActive: boolean;
}

export interface PatientDropdown {
  id: string;
  fullName: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  nationalId?: string | null;
  bloodType?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
}

export interface UpdatePatientRequest extends CreatePatientRequest {
  isActive: boolean;
}
