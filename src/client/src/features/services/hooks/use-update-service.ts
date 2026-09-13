import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateMedicalService } from "../api/medical-services";
import type { UpdateMedicalServiceRequest } from "@/types/medical-service";

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicalServiceRequest }) =>
      updateMedicalService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-services"] });
      queryClient.invalidateQueries({ queryKey: ["medical-services-dropdown"] });
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
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
