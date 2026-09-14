"use client";

import { useState } from "react";
import { Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import type { AttachmentListItem } from "@/types/attachment";
import { useAttachmentsByEntity } from "../hooks/use-attachments-by-entity";
import { useDeleteAttachment } from "../hooks/use-delete-attachment";
import { useDownloadAttachment } from "../hooks/use-download-attachment";
import { AttachmentList } from "./attachment-list";
import { AttachmentUploadDialog } from "./attachment-upload-dialog";
import { AttachmentPreviewDialog } from "./attachment-preview-dialog";

interface AttachmentsSectionProps {
  entityType: string;
  entityId: string;
}

export function AttachmentsSection({ entityType, entityId }: AttachmentsSectionProps) {
  const { t } = useTranslation();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<AttachmentListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttachmentListItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const attachmentsQuery = useAttachmentsByEntity(entityType, entityId);
  const deleteMutation = useDeleteAttachment();
  const downloadMutation = useDownloadAttachment();

  const handleDownload = (attachment: AttachmentListItem) => {
    setDownloadingId(attachment.id);
    downloadMutation.mutate(
      { id: attachment.id, fileName: attachment.originalFileName },
      { onSettled: () => setDownloadingId(null) },
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-5 w-5" />
          {t("attachments.title")}
        </CardTitle>
        <Button size="sm" className="gap-2" onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("attachments.upload")}
        </Button>
      </CardHeader>
      <CardContent>
        <AttachmentList
          items={attachmentsQuery.data ?? []}
          isPending={attachmentsQuery.isPending}
          onDownload={handleDownload}
          onPreview={setPreviewTarget}
          onDelete={setDeleteTarget}
          downloadingId={downloadingId}
        />
      </CardContent>

      <AttachmentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        entityType={entityType}
        entityId={entityId}
      />

      <AttachmentPreviewDialog
        attachment={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteAttachment.title")}
        description={t("confirm.deleteAttachment.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </Card>
  );
}
