import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateClinicSettings } from "../api/clinic";
import type { UpdateClinicSettingsRequest } from "@/types/clinic";

export function useUpdateClinicSettings() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: UpdateClinicSettingsRequest) =>
      updateClinicSettings(data),
    onSuccess: (_updated, data) => {
      queryClient.invalidateQueries({ queryKey: ["clinic", "settings"] });
      success(t("toast.updated"), data.currencyCode);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
