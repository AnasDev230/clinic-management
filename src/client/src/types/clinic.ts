export interface ClinicProfile {
  id: string;
  name: string;
  logo?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  workingHoursStart: string;
  workingHoursEnd: string;
  about?: string | null;
}

export interface ClinicSettings {
  id: string;
  currencyCode: string;
  timeZone: string;
  allowOnlineBooking: boolean;
  appointmentDurationMinutes: number;
  maxPatientsPerDay: number;
}

export interface UpdateClinicProfileRequest {
  name: string;
  logo?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  workingHoursStart: string;
  workingHoursEnd: string;
  about?: string | null;
}

export interface UpdateClinicSettingsRequest {
  currencyCode: string;
  timeZone: string;
  allowOnlineBooking: boolean;
  appointmentDurationMinutes: number;
  maxPatientsPerDay: number;
}
