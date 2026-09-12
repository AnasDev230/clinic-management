import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import {
  createMedicalHistory,
  deleteMedicalHistory,
  updateMedicalHistory,
} from "../api/patients";
import type {
  CreateMedicalHistoryRequest,
  UpdateMedicalHistoryRequest,
} from "@/types/patient";

function invalidatePatient(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["patients"] });
}

export function useCreateMedicalHistory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: CreateMedicalHistoryRequest;
    }) => createMedicalHistory(patientId, data),
    onSuccess: (_created, variables) => {
      invalidatePatient(queryClient);
      success(t("toast.created"), variables.data.title);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}

export function useUpdateMedicalHistory() {
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
      data: UpdateMedicalHistoryRequest;
    }) => updateMedicalHistory(patientId, id, data),
    onSuccess: (_updated, variables) => {
      invalidatePatient(queryClient);
      success(t("toast.updated"), variables.data.title);
    },
    onError: (err) => {
      error(
        t("toast.error.generic"),
        getErrorMessage(err) || t("common.unexpectedError"),
      );
    },
  });
}

export function useDeleteMedicalHistory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ patientId, id }: { patientId: string; id: string }) =>
      deleteMedicalHistory(patientId, id),
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
