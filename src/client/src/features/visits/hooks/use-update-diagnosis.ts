import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateDiagnosis } from "../api/diagnoses";
import type { UpdateDiagnosisRequest } from "@/types/visit";

export function useUpdateDiagnosis() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      visitId,
      id,
      data,
    }: {
      visitId: string;
      id: string;
      data: UpdateDiagnosisRequest;
    }) => updateDiagnosis(visitId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["diagnoses", variables.visitId],
      });
      success(t("toast.updated"), variables.data.name);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
