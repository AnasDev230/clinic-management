"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import {
  createUploadAttachmentSchema,
  type UploadAttachmentFormValues,
} from "../schemas/attachment-schema";
import { useUploadAttachment } from "../hooks/use-upload-attachment";
import { formatFileSize } from "./file-type-icon";

interface AttachmentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
}

export function AttachmentUploadDialog({
  open,
  onClose,
  entityType,
  entityId,
}: AttachmentUploadDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createUploadAttachmentSchema(t), [t]);
  const uploadMutation = useUploadAttachment();
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadAttachmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { file: undefined as unknown as File, description: "", tags: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ file: undefined as unknown as File, description: "", tags: "" });
      setProgress(0);
    }
  }, [open, form]);

  const selectedFile = form.watch("file") as unknown as File | undefined;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    form.setValue("file", file, { shouldValidate: true });
  };

  const onSubmit = (values: UploadAttachmentFormValues) => {
    setProgress(0);
    uploadMutation.mutate(
      {
        data: {
          file: values.file,
          relatedEntityType: entityType,
          relatedEntityId: entityId,
          description: values.description || null,
          tags: values.tags || null,
        },
        onProgress: setProgress,
      },
      { onSuccess: onClose },
    );
  };

  const isPending = uploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("attachments.upload")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-center transition-colors",
              dragOver && "border-primary bg-primary/5",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") fileInputRef.current?.click();
            }}
          >
            <CloudUpload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm">
              {t("attachments.dragDrop")}{" "}
              <span className="font-medium text-primary">{t("attachments.browse")}</span>
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {t("attachments.maxSize")}
            </p>
            {selectedFile && (
              <p className="text-sm font-medium tabular-nums">
                {selectedFile.name} · {formatFileSize(selectedFile.size)}
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
          {form.formState.errors.file && (
            <p className="text-sm text-destructive">
              {form.formState.errors.file.message}
            </p>
          )}
          <div className="space-y-2">
            <Label>{t("attachments.form.description")}</Label>
            <Input {...form.register("description")} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label>{t("attachments.form.tags")}</Label>
            <Input {...form.register("tags")} className="h-10" />
          </div>
          {isPending && (
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.executing") : t("attachments.upload")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
