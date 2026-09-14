"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { AttachmentListItem } from "@/types/attachment";
import { downloadAttachment } from "../api/attachments";
import { useDownloadAttachment } from "../hooks/use-download-attachment";
import { FileTypeIcon, formatFileSize, isPreviewableImage } from "./file-type-icon";

interface AttachmentPreviewDialogProps {
  attachment: AttachmentListItem | null;
  onClose: () => void;
}

export function AttachmentPreviewDialog({ attachment, onClose }: AttachmentPreviewDialogProps) {
  const { t, language } = useTranslation();
  const downloadMutation = useDownloadAttachment();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;

    if (attachment && isPreviewableImage(attachment.fileExtension)) {
      setIsLoading(true);
      downloadAttachment(attachment.id)
        .then((blob) => {
          if (cancelled) return;
          url = window.URL.createObjectURL(blob);
          setPreviewUrl(url);
        })
        .catch(() => {
          if (!cancelled) setPreviewUrl(null);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    } else {
      setPreviewUrl(null);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [attachment]);

  const showImage = attachment && isPreviewableImage(attachment.fileExtension);

  return (
    <Dialog open={attachment !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="truncate">{attachment?.originalFileName}</DialogTitle>
        </DialogHeader>
        {attachment && (
          <div className="space-y-4">
            {showImage ? (
              isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt={attachment.originalFileName}
                  className="max-h-96 w-full rounded-lg border border-border object-contain"
                />
              ) : null
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <FileTypeIcon extension={attachment.fileExtension} />
                <p className="text-sm text-muted-foreground tabular-nums">
                  {formatFileSize(attachment.fileSize)} · {attachment.uploadedByName} ·{" "}
                  {formatDate(attachment.createdAt, language)}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                className="gap-2"
                disabled={downloadMutation.isPending}
                onClick={() =>
                  downloadMutation.mutate({
                    id: attachment.id,
                    fileName: attachment.originalFileName,
                  })
                }
              >
                <Download className="h-4 w-4" />
                {t("attachments.download")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
