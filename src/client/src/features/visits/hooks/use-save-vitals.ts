import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { saveVitals } from "../api/vitals";
import type { CreateVitalsRequest } from "@/types/visit";

export function useSaveVitals() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      visitId,
      data,
    }: {
      visitId: string;
      data: CreateVitalsRequest;
    }) => saveVitals(visitId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vitals", variables.visitId],
      });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      success(t("toast.saved"));
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
