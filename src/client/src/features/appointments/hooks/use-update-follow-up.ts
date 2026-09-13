import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateFollowUp } from "../api/follow-ups";
import type { UpdateFollowUpRequest } from "@/types/appointment";

export function useUpdateFollowUp() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      appointmentId,
      id,
      data,
    }: {
      appointmentId: string;
      id: string;
      data: UpdateFollowUpRequest;
    }) => updateFollowUp(appointmentId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["follow-ups", variables.appointmentId],
      });
      success(t("toast.updated"));
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
