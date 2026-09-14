import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateAttachment } from "../api/attachments";
import type { UpdateAttachmentRequest } from "@/types/attachment";

export function useUpdateAttachment() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttachmentRequest }) =>
      updateAttachment(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
      success(t("toast.updated"), updated.originalFileName);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
