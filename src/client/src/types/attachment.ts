export interface AttachmentDetail {
  id: string;
  fileName: string;
  originalFileName: string;
  fileExtension: string;
  mimeType: string;
  fileSize: number;
  description?: string | null;
  tags?: string | null;
  uploadedByName: string;
  createdAt: string;
  downloadUrl: string;
}

export interface AttachmentListItem {
  id: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  uploadedByName: string;
  createdAt: string;
}

export interface UploadAttachmentRequest {
  file: File;
  relatedEntityType: string;
  relatedEntityId: string;
  description?: string | null;
  tags?: string | null;
}

export interface UpdateAttachmentRequest {
  description?: string | null;
  tags?: string | null;
}
