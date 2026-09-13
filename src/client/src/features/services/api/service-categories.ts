import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type {
  CreateServiceCategoryRequest,
  ServiceCategoryDetail,
  ServiceCategoryDropdown,
  ServiceCategoryListItem,
  UpdateServiceCategoryRequest,
} from "@/types/medical-service";

export async function fetchServiceCategories(
  isActive?: boolean,
): Promise<ServiceCategoryListItem[]> {
  const response = await apiClient.get<ApiResponse<ServiceCategoryListItem[]>>(
    "/service-categories",
    { params: isActive === undefined ? {} : { isActive } },
  );
  return response.data.data;
}

export async function fetchServiceCategoriesDropdown(): Promise<ServiceCategoryDropdown[]> {
  const response = await apiClient.get<ApiResponse<ServiceCategoryDropdown[]>>(
    "/service-categories/dropdown",
  );
  return response.data.data;
}

export async function fetchServiceCategory(id: string): Promise<ServiceCategoryDetail> {
  const response = await apiClient.get<ApiResponse<ServiceCategoryDetail>>(
    `/service-categories/${id}`,
  );
  return response.data.data;
}

export async function createServiceCategory(
  data: CreateServiceCategoryRequest,
): Promise<ServiceCategoryDetail> {
  const response = await apiClient.post<ApiResponse<ServiceCategoryDetail>>(
    "/service-categories",
    data,
  );
  return response.data.data;
}

export async function updateServiceCategory(
  id: string,
  data: UpdateServiceCategoryRequest,
): Promise<ServiceCategoryDetail> {
  const response = await apiClient.put<ApiResponse<ServiceCategoryDetail>>(
    `/service-categories/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteServiceCategory(id: string): Promise<void> {
  await apiClient.delete(`/service-categories/${id}`);
}
