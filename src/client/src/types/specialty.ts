export interface SpecialtyListItem {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface SpecialtyDetail extends SpecialtyListItem {
  createdAt: string;
  updatedAt?: string | null;
}

export interface SpecialtyDropdownItem {
  id: string;
  name: string;
}

export interface CreateSpecialtyRequest {
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdateSpecialtyRequest {
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
}
