import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { updateLabTest } from "../api/lab-tests";
import type { UpdateLabTestRequest } from "@/types/lab-test";

export function useUpdateLabTest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabTestRequest }) =>
      updateLabTest(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
      success(t("toast.updated"), updated.testName);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
