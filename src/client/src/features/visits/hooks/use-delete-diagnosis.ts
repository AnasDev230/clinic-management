import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { deleteDiagnosis } from "../api/diagnoses";

export function useDeleteDiagnosis() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ visitId, id }: { visitId: string; id: string }) =>
      deleteDiagnosis(visitId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["diagnoses", variables.visitId],
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
