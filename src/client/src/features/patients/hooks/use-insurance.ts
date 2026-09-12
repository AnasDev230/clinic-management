import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { deleteInsurance, saveInsurance } from "../api/patients";
import type { CreateInsuranceRequest } from "@/types/patient";

function invalidatePatient(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["patients"] });
}

export function useSaveInsurance() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateInsuranceRequest;
    }) => saveInsurance(patientId, data),
    onSuccess: (_saved, variables) => {
      invalidatePatient(queryClient);
      success(t("toast.saved"), variables.data.providerName);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}

export function useDeleteInsurance() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (patientId: string) => deleteInsurance(patientId),
    onSuccess: () => {
      invalidatePatient(queryClient);
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
