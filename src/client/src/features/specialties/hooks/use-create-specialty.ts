import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createSpecialty } from "../api/specialties";
import type { CreateSpecialtyRequest } from "@/types/specialty";

export function useCreateSpecialty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateSpecialtyRequest) => createSpecialty(data),
    onSuccess: (_created, data) => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      queryClient.invalidateQueries({ queryKey: ["specialties-dropdown"] });
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
