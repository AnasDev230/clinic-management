"use client";

import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { createVitalsSchema, type VitalsFormValues } from "../schemas/vitals-schema";
import { useSaveVitals } from "../hooks/use-save-vitals";

interface VitalsFormProps {
  visitId: string;
  initialValues?: Partial<VitalsFormValues>;
}

export function VitalsForm({ visitId, initialValues }: VitalsFormProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createVitalsSchema(t), [t]);
  const saveMutation = useSaveVitals();

  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<VitalsFormValues>,
    defaultValues: {
      temperature: null,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      heartRate: null,
      respiratoryRate: null,
      oxygenSaturation: null,
      weight: null,
      height: null,
      notes: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        temperature: initialValues.temperature ?? null,
        bloodPressureSystolic: initialValues.bloodPressureSystolic ?? null,
        bloodPressureDiastolic: initialValues.bloodPressureDiastolic ?? null,
        heartRate: initialValues.heartRate ?? null,
        respiratoryRate: initialValues.respiratoryRate ?? null,
        oxygenSaturation: initialValues.oxygenSaturation ?? null,
        weight: initialValues.weight ?? null,
        height: initialValues.height ?? null,
        notes: initialValues.notes ?? "",
      });
    }
  }, [initialValues, form]);

  const weightRaw = form.watch("weight");
  const heightRaw = form.watch("height");
  const weight = Number(weightRaw);
  const height = Number(heightRaw);
  const bmi =
    weight > 0 && height > 0 && !Number.isNaN(weight) && !Number.isNaN(height)
      ? weight / Math.pow(height / 100, 2)
      : null;

  const onSubmit = (values: VitalsFormValues) => {
    const num = (v: number | null | undefined): number | null => {
      if (v === null || v === undefined) return null;
      return v;
    };
    const intOrNull = (v: number | null | undefined): number | null => {
      if (v === null || v === undefined) return null;
      return Math.round(v);
    };
    saveMutation.mutate({
      visitId,
      data: {
        temperature: num(values.temperature),
        bloodPressureSystolic: intOrNull(values.bloodPressureSystolic),
        bloodPressureDiastolic: intOrNull(values.bloodPressureDiastolic),
        heartRate: intOrNull(values.heartRate),
        respiratoryRate: intOrNull(values.respiratoryRate),
        oxygenSaturation: num(values.oxygenSaturation),
        weight: num(values.weight),
        height: num(values.height),
        notes: values.notes || null,
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>{t("vitals.form.temperature")}</Label>
          <Input
            inputMode="decimal"
            className="h-10 tabular-nums"
            value={form.watch("temperature") ?? ""}
            onChange={(e) =>
              form.setValue(
                "temperature",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.temperature && (
            <p className="text-sm text-destructive">{form.formState.errors.temperature.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.systolic")}</Label>
          <Input
            inputMode="numeric"
            className="h-10 tabular-nums"
            value={form.watch("bloodPressureSystolic") ?? ""}
            onChange={(e) =>
              form.setValue(
                "bloodPressureSystolic",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.bloodPressureSystolic && (
            <p className="text-sm text-destructive">{form.formState.errors.bloodPressureSystolic.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.diastolic")}</Label>
          <Input
            inputMode="numeric"
            className="h-10 tabular-nums"
            value={form.watch("bloodPressureDiastolic") ?? ""}
            onChange={(e) =>
              form.setValue(
                "bloodPressureDiastolic",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.bloodPressureDiastolic && (
            <p className="text-sm text-destructive">{form.formState.errors.bloodPressureDiastolic.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.heartRate")}</Label>
          <Input
            inputMode="numeric"
            className="h-10 tabular-nums"
            value={form.watch("heartRate") ?? ""}
            onChange={(e) =>
              form.setValue(
                "heartRate",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.heartRate && (
            <p className="text-sm text-destructive">{form.formState.errors.heartRate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.respiratoryRate")}</Label>
          <Input
            inputMode="numeric"
            className="h-10 tabular-nums"
            value={form.watch("respiratoryRate") ?? ""}
            onChange={(e) =>
              form.setValue(
                "respiratoryRate",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.respiratoryRate && (
            <p className="text-sm text-destructive">{form.formState.errors.respiratoryRate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.oxygenSaturation")}</Label>
          <Input
            inputMode="decimal"
            className="h-10 tabular-nums"
            value={form.watch("oxygenSaturation") ?? ""}
            onChange={(e) =>
              form.setValue(
                "oxygenSaturation",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.oxygenSaturation && (
            <p className="text-sm text-destructive">{form.formState.errors.oxygenSaturation.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.weight")}</Label>
          <Input
            inputMode="decimal"
            className="h-10 tabular-nums"
            value={form.watch("weight") ?? ""}
            onChange={(e) =>
              form.setValue(
                "weight",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.weight && (
            <p className="text-sm text-destructive">{form.formState.errors.weight.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.form.height")}</Label>
          <Input
            inputMode="decimal"
            className="h-10 tabular-nums"
            value={form.watch("height") ?? ""}
            onChange={(e) =>
              form.setValue(
                "height",
                e.target.value === "" ? null : (Number(e.target.value) as unknown as null),
              )
            }
          />
          {form.formState.errors.height && (
            <p className="text-sm text-destructive">{form.formState.errors.height.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("vitals.bmi")}</Label>
          <p className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm tabular-nums">
            {bmi !== null ? bmi.toFixed(1) : "-"}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t("vitals.form.notes")}</Label>
        <Textarea {...form.register("notes")} rows={2} />
      </div>
      <Button type="submit" disabled={saveMutation.isPending}>
        {saveMutation.isPending ? t("common.executing") : t("vitals.save")}
      </Button>
    </form>
  );
}
