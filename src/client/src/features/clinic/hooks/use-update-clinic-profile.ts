import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateClinicProfile } from "../api/clinic";
import type { UpdateClinicProfileRequest } from "@/types/clinic";

export function useUpdateClinicProfile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: UpdateClinicProfileRequest) => updateClinicProfile(data),
    onSuccess: (_updated, data) => {
      queryClient.invalidateQueries({ queryKey: ["clinic", "profile"] });
      success(t("toast.updated"), data.name);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
