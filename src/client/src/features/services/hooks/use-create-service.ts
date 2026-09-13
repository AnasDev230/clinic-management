import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createMedicalService } from "../api/medical-services";
import type { CreateMedicalServiceRequest } from "@/types/medical-service";

export function useCreateService() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateMedicalServiceRequest) => createMedicalService(data),
    onSuccess: (_created, data) => {
      queryClient.invalidateQueries({ queryKey: ["medical-services"] });
      queryClient.invalidateQueries({ queryKey: ["medical-services-dropdown"] });
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      success(t("toast.created"), data.name);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
