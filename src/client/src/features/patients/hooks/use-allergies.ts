import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { createAllergy, deleteAllergy, updateAllergy } from "../api/patients";
import type {
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "@/types/patient";

function invalidatePatient(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["patients"] });
}

export function useCreateAllergy() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateAllergyRequest;
    }) => createAllergy(patientId, data),
    onSuccess: (_created, variables) => {
      invalidatePatient(queryClient);
      success(t("toast.created"), variables.data.name);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}

export function useUpdateAllergy() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      patientId,
      id,
      data,
    }: {
      patientId: string;
      id: string;
      data: UpdateAllergyRequest;
    }) => updateAllergy(patientId, id, data),
    onSuccess: (_updated, variables) => {
      invalidatePatient(queryClient);
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

export function useDeleteAllergy() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ patientId, id }: { patientId: string; id: string }) =>
      deleteAllergy(patientId, id),
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
