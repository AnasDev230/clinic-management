"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import {
  useDeleteInsurance,
  useSaveInsurance,
} from "../hooks/use-insurance";
import {
  createInsuranceSchema,
  type InsuranceFormValues,
} from "../schemas/insurance-schema";
import type { InsuranceDetail } from "@/types/patient";

function toDateInput(value: string): string {
  return value.length >= 10 ? value.slice(0, 10) : value;
}

export function InsuranceSection({
  patientId,
  insurance,
}: {
  patientId: string;
  insurance?: InsuranceDetail | null;
}) {
  const { t, language } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveMutation = useSaveInsurance();
  const deleteMutation = useDeleteInsurance();

  const form = useForm<InsuranceFormValues>({
    resolver: zodResolver(createInsuranceSchema(t)),
    defaultValues: {
      providerName: "",
      policyNumber: "",
      groupNumber: "",
      expiryDate: "",
      coveragePercentage: 0,
      isActive: true,
    },
  });

  const openForm = () => {
    form.reset(
      insurance
        ? {
            providerName: insurance.providerName,
            policyNumber: insurance.policyNumber,
            groupNumber: insurance.groupNumber ?? "",
            expiryDate: toDateInput(insurance.expiryDate),
            coveragePercentage: insurance.coveragePercentage,
            isActive: insurance.isActive,
          }
        : {
            providerName: "",
            policyNumber: "",
            groupNumber: "",
            expiryDate: "",
            coveragePercentage: 0,
            isActive: true,
          },
    );
    setFormOpen(true);
  };

  const onSubmit = (values: InsuranceFormValues) => {
    saveMutation.mutate(
      {
        patientId,
        data: {
          providerName: values.providerName,
          policyNumber: values.policyNumber,
          groupNumber: values.groupNumber || null,
          expiryDate: values.expiryDate,
          coveragePercentage: values.coveragePercentage,
          isActive: values.isActive,
        },
      },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  const isExpired = insurance
    ? new Date(insurance.expiryDate) < new Date()
    : false;

  return (
    <div className="space-y-4">
      {!insurance && !formOpen && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("patients.insurance.empty")}
          </p>
          <Button size="sm" className="gap-2" onClick={openForm}>
            <Plus className="h-4 w-4" />
            {t("patients.insurance.edit")}
          </Button>
        </div>
      )}

      {insurance && !formOpen && (
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                {insurance.providerName}
                <Badge variant={isExpired ? "danger" : "success"}>
                  {isExpired
                    ? t("patients.insurance.expired")
                    : t("patients.insurance.active")}
                </Badge>
              </p>
              <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <p>
                  {t("patients.insurance.policy")}:{" "}
                  <span className="tabular-nums">{insurance.policyNumber}</span>
                </p>
                {insurance.groupNumber && (
                  <p>
                    {t("patients.insurance.group")}:{" "}
                    <span className="tabular-nums">{insurance.groupNumber}</span>
                  </p>
                )}
                <p>
                  {t("patients.insurance.expiry")}:{" "}
                  <span className="tabular-nums">
                    {formatDate(insurance.expiryDate, language)}
                  </span>
                </p>
                <p>
                  {t("patients.insurance.coverage")}:{" "}
                  <span className="tabular-nums">
                    {insurance.coveragePercentage}%
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={openForm}
                aria-label={t("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmDelete(true)}
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("patients.insurance.provider")} *</Label>
              <Input {...form.register("providerName")} />
              {form.formState.errors.providerName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.providerName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("patients.insurance.policy")} *</Label>
              <Input {...form.register("policyNumber")} />
              {form.formState.errors.policyNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.policyNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("patients.insurance.group")}</Label>
              <Input {...form.register("groupNumber")} />
            </div>
            <div className="space-y-2">
              <Label>{t("patients.insurance.expiry")} *</Label>
              <Input type="date" {...form.register("expiryDate")} />
              {form.formState.errors.expiryDate && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expiryDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("patients.insurance.coverage")} *</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...form.register("coveragePercentage")}
              />
              {form.formState.errors.coveragePercentage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.coveragePercentage.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-4">
              <Label>{t("patients.form.isActive")}</Label>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={saveMutation.isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="gap-2"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {saveMutation.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t("confirm.delete.title")}
        description={t("confirm.delete.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(patientId, {
            onSuccess: () => setConfirmDelete(false),
          })
        }
      />
    </div>
  );
}
