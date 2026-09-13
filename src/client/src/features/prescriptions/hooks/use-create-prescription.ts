import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createPrescription } from "../api/prescriptions";
import type { CreatePrescriptionRequest } from "@/types/prescription";

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreatePrescriptionRequest) => createPrescription(data),
    onSuccess: (_created, data) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      success(t("toast.created"), data.notes ?? undefined);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
