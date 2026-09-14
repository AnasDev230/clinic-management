"use client";

import { File, FileText, Image, Table } from "lucide-react";

export function FileTypeIcon({ extension }: { extension: string }) {
  const className = "h-5 w-5 shrink-0";
  const ext = extension.replace(".", "").toLowerCase();

  if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
    return <Image className={className} />;
  }
  if (["xls", "xlsx"].includes(ext)) {
    return <Table className={className} />;
  }
  if (["pdf", "doc", "docx"].includes(ext)) {
    return <FileText className={className} />;
  }
  return <File className={className} />;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isPreviewableImage(extension: string): boolean {
  const ext = extension.replace(".", "").toLowerCase();
  return ["jpg", "jpeg", "png", "gif"].includes(ext);
}
