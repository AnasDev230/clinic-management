import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createServiceCategory } from "../api/service-categories";
import type { CreateServiceCategoryRequest } from "@/types/medical-service";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateServiceCategoryRequest) => createServiceCategory(data),
    onSuccess: (_created, data) => {
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
