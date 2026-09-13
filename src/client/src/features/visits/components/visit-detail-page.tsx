"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/formatters";
import { updateVisitSchema, type UpdateVisitFormValues } from "../schemas/visit-schema";
import { useVisit } from "../hooks/use-visit";
import { useUpdateVisit } from "../hooks/use-update-visit";
import { useStartConsultation } from "../hooks/use-start-consultation";
import { useCompleteVisit } from "../hooks/use-complete-visit";
import { VisitStatus } from "@/types/visit";
import { VisitStatusBadge } from "./visit-status-badge";

interface VisitDetailPageProps {
  visitId: string;
}

export function VisitDetailPage({ visitId }: VisitDetailPageProps) {
  const { t, language } = useTranslation();
  const visitQuery = useVisit(visitId);
  const updateMutation = useUpdateVisit();
  const startMutation = useStartConsultation();
  const completeMutation = useCompleteVisit();
  const schema = useMemo(() => updateVisitSchema(t), [t]);

  const form = useForm<UpdateVisitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      chiefComplaint: "",
      symptoms: "",
      diagnosis: "",
      treatmentPlan: "",
      notes: "",
      nextVisitRecommended: false,
      nextVisitNotes: "",
      totalAmount: 0,
      discountAmount: 0,
    },
  });

  const visit = visitQuery.data;

  useEffect(() => {
    if (visit) {
      form.reset({
        chiefComplaint: visit.chiefComplaint ?? "",
        symptoms: visit.symptoms ?? "",
        diagnosis: visit.diagnosis ?? "",
        treatmentPlan: visit.treatmentPlan ?? "",
        notes: visit.notes ?? "",
        nextVisitRecommended: visit.nextVisitRecommended,
        nextVisitNotes: visit.nextVisitNotes ?? "",
        totalAmount: visit.totalAmount,
        discountAmount: visit.discountAmount,
      });
    }
  }, [visit, form]);

  const total = Number(form.watch("totalAmount") ?? 0);
  const discount = Number(form.watch("discountAmount") ?? 0);
  const finalAmount = Math.max(0, total - discount);

  if (visitQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!visit) return null;

  const onSubmit = (values: UpdateVisitFormValues) => {
    updateMutation.mutate({
      id: visitId,
      data: {
        chiefComplaint: values.chiefComplaint || null,
        symptoms: values.symptoms || null,
        diagnosis: values.diagnosis || null,
        treatmentPlan: values.treatmentPlan || null,
        notes: values.notes || null,
        nextVisitRecommended: values.nextVisitRecommended,
        nextVisitNotes: values.nextVisitNotes || null,
        totalAmount: Number(values.totalAmount),
        discountAmount: Number(values.discountAmount),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>
              {visit.patientName} - {visit.doctorName}
            </CardTitle>
            <VisitStatusBadge status={visit.status as VisitStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {visit.status === VisitStatus.Waiting && (
              <Button
                size="sm"
                className="gap-2"
                disabled={startMutation.isPending}
                onClick={() => startMutation.mutate(visitId)}
              >
                {t("visits.startConsultation")}
              </Button>
            )}
            {visit.status === VisitStatus.InConsultation && (
              <Button
                size="sm"
                className="gap-2"
                disabled={completeMutation.isPending}
                onClick={() => completeMutation.mutate(visitId)}
              >
                {t("visits.completeVisit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("visits.tabs.consultation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("visits.form.chiefComplaint")}</Label>
                <Textarea {...form.register("chiefComplaint")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.symptoms")}</Label>
                <Textarea {...form.register("symptoms")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.diagnosis")}</Label>
                <Textarea {...form.register("diagnosis")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.treatmentPlan")}</Label>
                <Textarea {...form.register("treatmentPlan")} rows={3} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("visits.form.notes")}</Label>
              <Textarea {...form.register("notes")} rows={2} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>{t("visits.form.nextVisitRecommended")}</Label>
              <Switch
                checked={form.watch("nextVisitRecommended")}
                onCheckedChange={(v) => form.setValue("nextVisitRecommended", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("visits.form.nextVisitNotes")}</Label>
              <Textarea {...form.register("nextVisitNotes")} rows={2} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("visits.form.totalAmount")}</Label>
                <Input type="number" step="0.01" {...form.register("totalAmount")} className="h-10 tabular-nums" />
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.discountAmount")}</Label>
                <Input type="number" step="0.01" {...form.register("discountAmount")} className="h-10 tabular-nums" />
                {form.formState.errors.discountAmount && (
                  <p className="text-sm text-destructive">{form.formState.errors.discountAmount.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.finalAmount")}</Label>
                <p className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm tabular-nums">
                  {formatCurrency(finalAmount, language)}
                </p>
              </div>
            </div>

            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t("common.executing") : t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
