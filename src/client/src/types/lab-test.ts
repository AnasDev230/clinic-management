export enum LabTestStatus {
  Ordered = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum LabTestPriority {
  Routine = 0,
  Normal = 1,
  Urgent = 2,
  Stat = 3,
}

export interface LabResultDetail {
  id: string;
  labTestId: string;
  parameterName: string;
  value?: string | null;
  unit?: string | null;
  normalRange?: string | null;
  isAbnormal: boolean;
  notes?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LabTestDetail {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderedByDoctorName: string;
  testName: string;
  testCategory?: string | null;
  orderedDate: string;
  status: LabTestStatus;
  priority: LabTestPriority;
  notes?: string | null;
  results: LabResultDetail[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface LabTestListItem {
  id: string;
  testName: string;
  testCategory?: string | null;
  patientName: string;
  orderedDate: string;
  status: LabTestStatus;
  priority: LabTestPriority;
  resultCount: number;
}

export interface CreateLabResultRequest {
  parameterName: string;
  value?: string | null;
  unit?: string | null;
  normalRange?: string | null;
  isAbnormal: boolean;
  notes?: string | null;
}

export interface UpdateLabResultRequest extends CreateLabResultRequest {
  id?: string | null;
}

export interface CreateLabTestRequest {
  visitId: string;
  testName: string;
  testCategory?: string | null;
  priority: LabTestPriority;
  notes?: string | null;
  results?: CreateLabResultRequest[] | null;
}

export interface UpdateLabTestRequest {
  testName: string;
  testCategory?: string | null;
  priority: LabTestPriority;
  status: LabTestStatus;
  notes?: string | null;
  results?: UpdateLabResultRequest[] | null;
}
