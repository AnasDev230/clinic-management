import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createLabTest } from "../api/lab-tests";
import type { CreateLabTestRequest } from "@/types/lab-test";

export function useCreateLabTest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateLabTestRequest) => createLabTest(data),
    onSuccess: (_created, data) => {
      queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
      success(t("toast.created"), data.testName);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}
