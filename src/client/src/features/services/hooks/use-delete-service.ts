import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { deleteMedicalService } from "../api/medical-services";

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteMedicalService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-services"] });
      queryClient.invalidateQueries({ queryKey: ["medical-services-dropdown"] });
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
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
