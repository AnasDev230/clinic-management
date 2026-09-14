"use client";

import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { AttachmentListItem } from "@/types/attachment";
import { FileTypeIcon, formatFileSize } from "./file-type-icon";

interface AttachmentItemProps {
  attachment: AttachmentListItem;
  onDownload: (attachment: AttachmentListItem) => void;
  onPreview: (attachment: AttachmentListItem) => void;
  onDelete: (attachment: AttachmentListItem) => void;
  isDownloading?: boolean;
}

export function AttachmentItem({
  attachment,
  onDownload,
  onPreview,
  onDelete,
  isDownloading = false,
}: AttachmentItemProps) {
  const { t, language } = useTranslation();

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
      <span className="text-muted-foreground">
        <FileTypeIcon extension={attachment.fileExtension} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{attachment.originalFileName}</p>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {formatFileSize(attachment.fileSize)} · {attachment.uploadedByName} ·{" "}
          {formatDate(attachment.createdAt, language)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPreview(attachment)}
          aria-label={t("attachments.preview")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDownloading}
          onClick={() => onDownload(attachment)}
          aria-label={t("attachments.download")}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(attachment)}
          aria-label={t("attachments.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
