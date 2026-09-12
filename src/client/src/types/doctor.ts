export interface DoctorScheduleInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface DoctorScheduleItem extends DoctorScheduleInput {
  id: string;
  isActive: boolean;
}

export interface DoctorSpecialtyItem {
  specialtyId: string;
  specialtyName: string;
}

export interface DoctorDetail {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string | null;
  profileImage?: string | null;
  isActive: boolean;
  applicationUserId: string;
  temporaryPassword?: string | null;
  specialties: DoctorSpecialtyItem[];
  schedules: DoctorScheduleItem[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface DoctorListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialties: string[];
  isActive: boolean;
}

export interface DoctorDropdown {
  id: string;
  fullName: string;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string | null;
  specialtyIds: string[];
  schedules: DoctorScheduleInput[];
}

export interface UpdateDoctorRequest extends CreateDoctorRequest {
  isActive: boolean;
}
