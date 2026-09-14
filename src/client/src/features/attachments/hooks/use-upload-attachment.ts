import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { uploadAttachment } from "../api/attachments";
import type { UploadAttachmentRequest } from "@/types/attachment";

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      data,
      onProgress,
    }: {
      data: UploadAttachmentRequest;
      onProgress?: (percent: number) => void;
    }) => uploadAttachment(data, onProgress),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
      success(t("toast.uploaded"), created.originalFileName);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
