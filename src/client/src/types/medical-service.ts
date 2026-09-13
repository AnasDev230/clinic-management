export interface ServiceCategoryDetail {
  id: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  serviceCount: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ServiceCategoryListItem {
  id: string;
  name: string;
  description?: string | null;
  serviceCount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceCategoryDropdown {
  id: string;
  name: string;
}

export interface MedicalServiceDetail {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  categoryName: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  requiresAppointment: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MedicalServiceListItem {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface MedicalServiceDropdown {
  id: string;
  name: string;
  price: number;
}

export interface CreateServiceCategoryRequest {
  name: string;
  description?: string | null;
  sortOrder: number;
}

export interface UpdateServiceCategoryRequest {
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateMedicalServiceRequest {
  name: string;
  description?: string | null;
  categoryId: string;
  price: number;
  durationMinutes: number;
  requiresAppointment: boolean;
  sortOrder: number;
}

export interface UpdateMedicalServiceRequest extends CreateMedicalServiceRequest {
  isActive: boolean;
}
