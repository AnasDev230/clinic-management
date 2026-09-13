"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/billing/schemas/invoice-schema";
import {
  InvoiceItemsEditor,
  calculateInvoiceTotals,
  type InvoiceLineInput,
} from "@/features/billing/components/invoices/invoice-items-editor";
import { useCreateInvoice } from "@/features/billing/hooks/use-create-invoice";
import { usePatientsDropdown } from "@/features/patients/hooks/use-patients-dropdown";
import { useDoctorsDropdown } from "@/features/doctors/hooks/use-doctors-dropdown";
import { useMedicalServicesDropdown } from "@/features/services/hooks/use-medical-services-dropdown";
import { useVisits } from "@/features/visits/hooks/use-visits";

export default function NewInvoicePage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const schema = useMemo(() => createInvoiceSchema(t), [t]);
  const createMutation = useCreateInvoice();

  const patientsQuery = usePatientsDropdown();
  const doctorsQuery = useDoctorsDropdown();
  const servicesQuery = useMedicalServicesDropdown();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: "",
      visitId: "",
      doctorId: "",
      dueDate: "",
      discountPercentage: 0,
      taxPercentage: 0,
      notes: "",
      items: [
        {
          id: "",
          serviceName: "",
          description: "",
          medicalServiceId: "",
          quantity: 1,
          unitPrice: 0,
          discountAmount: 0,
        },
      ],
    },
  });

  const selectedPatient = form.watch("patientId");
  const visitsQuery = useVisits({
    patientId: selectedPatient || undefined,
    page: 1,
    pageSize: 100,
  });

  const [submitError, setSubmitError] = useState(false);

  const watchedItems = (form.watch("items") ?? []) as InvoiceLineInput[];
  const totals = calculateInvoiceTotals(
    watchedItems,
    Number(form.watch("discountPercentage") ?? 0),
    Number(form.watch("taxPercentage") ?? 0),
  );

  const onSubmit = (values: InvoiceFormValues) => {
    setSubmitError(false);
    createMutation.mutate(
      {
        patientId: values.patientId,
        visitId: values.visitId || null,
        doctorId: values.doctorId || null,
        dueDate: values.dueDate || null,
        discountPercentage: Number(values.discountPercentage),
        taxPercentage: Number(values.taxPercentage),
        notes: values.notes || null,
        items: values.items.map((item) => ({
          serviceName: item.serviceName,
          description: item.description || null,
          medicalServiceId: item.medicalServiceId || null,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discountAmount: Number(item.discountAmount ?? 0),
        })),
      },
      {
        onSuccess: (created) => router.push(`/billing/invoices/${created.id}`),
        onError: () => setSubmitError(true),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("invoices.new")}</h1>
          <p className="text-muted-foreground text-sm">{t("invoices.description")}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/billing/invoices")}>
          {t("common.back")}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border bg-card">
          <CardContent className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("invoices.form.patient")}</Label>
              <Select
                value={form.watch("patientId")}
                onValueChange={(v) => {
                  form.setValue("patientId", v);
                  form.setValue("visitId", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("invoices.selectPatient")} />
                </SelectTrigger>
                <SelectContent>
                  {(patientsQuery.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patientId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.patientId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.visit")}</Label>
              <Select
                value={form.watch("visitId") || "none"}
                onValueChange={(v) => form.setValue("visitId", v === "none" ? "" : v)}
                disabled={!selectedPatient}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("invoices.selectVisit")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("invoices.selectVisit")}</SelectItem>
                  {(visitsQuery.data?.items ?? []).map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {formatDate(v.visitDate, language)} · {v.doctorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.doctor")}</Label>
              <Select
                value={form.watch("doctorId") || "none"}
                onValueChange={(v) => form.setValue("doctorId", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("invoices.selectDoctor")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("invoices.selectDoctor")}</SelectItem>
                  {(doctorsQuery.data ?? []).map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.dueDate")}</Label>
              <Input type="date" {...form.register("dueDate")} className="h-10 tabular-nums" />
              {form.formState.errors.dueDate && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.discountPercentage")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register("discountPercentage")}
                className="h-10 tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.taxPercentage")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register("taxPercentage")}
                className="h-10 tabular-nums"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">{t("invoices.items.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceItemsEditor form={form} services={servicesQuery.data ?? []} />
            {form.formState.errors.items?.message && (
              <p className="mt-2 text-sm text-destructive">
                {String(form.formState.errors.items.message)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>{t("invoices.form.notes")}</Label>
              <Textarea {...form.register("notes")} rows={2} />
            </div>
            <div className="ms-auto w-full max-w-72 space-y-1 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{t("invoices.summary.subTotal")}</span>
                <span className="tabular-nums">{formatCurrency(totals.subTotal, language)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{t("invoices.summary.discount")}</span>
                <span className="tabular-nums">{formatCurrency(totals.discountAmount, language)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{t("invoices.summary.tax")}</span>
                <span className="tabular-nums">{formatCurrency(totals.taxAmount, language)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-1 font-semibold">
                <span>{t("invoices.summary.total")}</span>
                <span className="tabular-nums">{formatCurrency(totals.total, language)}</span>
              </div>
            </div>
            {submitError && (
              <p className="text-sm text-destructive">{t("toast.error.generic")}</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/billing/invoices")}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createMutation.isPending ? t("common.executing") : t("common.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
