"use client";

import { Paperclip } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { AttachmentListItem } from "@/types/attachment";
import { AttachmentItem } from "./attachment-item";

interface AttachmentListProps {
  items: AttachmentListItem[];
  isPending: boolean;
  onDownload: (attachment: AttachmentListItem) => void;
  onPreview: (attachment: AttachmentListItem) => void;
  onDelete: (attachment: AttachmentListItem) => void;
  downloadingId?: string | null;
}

export function AttachmentList({
  items,
  isPending,
  onDownload,
  onPreview,
  onDelete,
  downloadingId = null,
}: AttachmentListProps) {
  const { t } = useTranslation();

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-5 w-5" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <Paperclip className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">{t("attachments.empty.title")}</p>
        <p className="text-xs text-muted-foreground">{t("attachments.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          onDownload={onDownload}
          onPreview={onPreview}
          onDelete={onDelete}
          isDownloading={downloadingId === attachment.id}
        />
      ))}
    </div>
  );
}
