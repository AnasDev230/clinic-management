import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createDiagnosis } from "../api/diagnoses";
import type { CreateDiagnosisRequest } from "@/types/visit";

export function useCreateDiagnosis() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      visitId,
      data,
    }: {
      visitId: string;
      data: CreateDiagnosisRequest;
    }) => createDiagnosis(visitId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["diagnoses", variables.visitId],
      });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      success(t("toast.created"), variables.data.name);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
