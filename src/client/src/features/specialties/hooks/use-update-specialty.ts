import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateSpecialty } from "../api/specialties";
import type { UpdateSpecialtyRequest } from "@/types/specialty";

export function useUpdateSpecialty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialtyRequest }) =>
      updateSpecialty(id, data),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      queryClient.invalidateQueries({ queryKey: ["specialties-dropdown"] });
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
