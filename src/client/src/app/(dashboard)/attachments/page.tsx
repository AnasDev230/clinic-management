"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { AttachmentListItem } from "@/types/attachment";
import { AttachmentList } from "@/features/attachments/components/attachment-list";
import { AttachmentPreviewDialog } from "@/features/attachments/components/attachment-preview-dialog";
import { useAttachments } from "@/features/attachments/hooks/use-attachments";
import { useDeleteAttachment } from "@/features/attachments/hooks/use-delete-attachment";
import { useDownloadAttachment } from "@/features/attachments/hooks/use-download-attachment";

export default function AttachmentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [previewTarget, setPreviewTarget] = useState<AttachmentListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttachmentListItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const attachmentsQuery = useAttachments({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
  });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("attachments.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("attachments.empty.description")}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("attachments.search.placeholder")}
            className="ps-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <AttachmentList
            items={attachmentsQuery.data?.items ?? []}
            isPending={attachmentsQuery.isPending}
            onDownload={handleDownload}
            onPreview={setPreviewTarget}
            onDelete={setDeleteTarget}
            downloadingId={downloadingId}
          />
        </CardContent>
      </Card>

      {(attachmentsQuery.data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("common.page")} {attachmentsQuery.data?.page} {t("common.of")}{" "}
            {attachmentsQuery.data?.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                attachmentsQuery.data != null && page >= attachmentsQuery.data.totalPages
              }
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
}
