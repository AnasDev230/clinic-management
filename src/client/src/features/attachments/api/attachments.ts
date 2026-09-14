import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  AttachmentDetail,
  AttachmentListItem,
  UpdateAttachmentRequest,
  UploadAttachmentRequest,
} from "@/types/attachment";

export interface FetchAttachmentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export async function fetchAttachmentsList(
  params: FetchAttachmentsParams = {},
): Promise<PagedResult<AttachmentListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<AttachmentListItem>>>(
    "/attachments",
    { params },
  );
  return response.data.data;
}

export async function fetchAttachment(id: string): Promise<AttachmentDetail> {
  const response = await apiClient.get<ApiResponse<AttachmentDetail>>(
    `/attachments/${id}`,
  );
  return response.data.data;
}

export async function fetchAttachmentsByEntity(
  entityType: string,
  entityId: string,
): Promise<AttachmentListItem[]> {
  const response = await apiClient.get<ApiResponse<AttachmentListItem[]>>(
    `/attachments/entity/${entityType}/${entityId}`,
  );
  return response.data.data;
}

export async function uploadAttachment(
  data: UploadAttachmentRequest,
  onUploadProgress?: (percent: number) => void,
): Promise<AttachmentDetail> {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("relatedEntityType", data.relatedEntityType);
  formData.append("relatedEntityId", data.relatedEntityId);
  if (data.description) formData.append("description", data.description);
  if (data.tags) formData.append("tags", data.tags);

  const response = await apiClient.post<ApiResponse<AttachmentDetail>>(
    "/attachments/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    },
  );
  return response.data.data;
}

export async function updateAttachment(
  id: string,
  data: UpdateAttachmentRequest,
): Promise<AttachmentDetail> {
  const response = await apiClient.put<ApiResponse<AttachmentDetail>>(
    `/attachments/${id}`,
    data,
  );
  return response.data.data;
}

export async function downloadAttachment(id: string): Promise<Blob> {
  const response = await apiClient.get(`/attachments/${id}/download`, {
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function deleteAttachment(id: string): Promise<void> {
  await apiClient.delete(`/attachments/${id}`);
}
