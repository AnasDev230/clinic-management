export enum AppointmentStatus {
  Scheduled = 0,
  Confirmed = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  NoShow = 5,
}

export enum AppointmentType {
  InPerson = 0,
  Phone = 1,
  VideoCall = 2,
  Emergency = 3,
}

export enum AppointmentPriority {
  Low = 0,
  Normal = 1,
  High = 2,
  Urgent = 3,
}

export interface AppointmentDetail {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason?: string | null;
  notes?: string | null;
  priority: AppointmentPriority;
  durationMinutes: number;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  visitId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AppointmentListItem {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  priority: AppointmentPriority;
}

export interface AppointmentCalendarItem {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  reason?: string | null;
  notes?: string | null;
  priority: AppointmentPriority;
  durationMinutes: number;
}

export interface UpdateAppointmentRequest extends CreateAppointmentRequest {
  status: AppointmentStatus;
}

export interface CancelAppointmentRequest {
  cancellationReason: string;
}

export interface FollowUpItem {
  id: string;
  appointmentId: string;
  followUpDate: string;
  notes?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateFollowUpRequest {
  followUpDate: string;
  notes?: string | null;
}

export interface UpdateFollowUpRequest extends CreateFollowUpRequest {
  isCompleted: boolean;
}
