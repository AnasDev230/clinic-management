import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { deleteFollowUp } from "../api/follow-ups";

export function useDeleteFollowUp() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      appointmentId,
      id,
    }: {
      appointmentId: string;
      id: string;
    }) => deleteFollowUp(appointmentId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["follow-ups", variables.appointmentId],
      });
      success(t("toast.deleted"));
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
