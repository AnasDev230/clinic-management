import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateDoctor } from "../api/doctors";
import type { UpdateDoctorRequest } from "@/types/doctor";

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoctorRequest }) =>
      updateDoctor(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors-dropdown"] });
      success(t("toast.updated"), `${updated.firstName} ${updated.lastName}`);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
