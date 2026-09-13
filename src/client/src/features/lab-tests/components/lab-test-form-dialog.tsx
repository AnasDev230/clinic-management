"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  createLabTestSchema,
  type LabTestFormValues,
} from "../schemas/lab-test-schema";
import { useCreateLabTest } from "../hooks/use-create-lab-test";
import { useUpdateLabTest } from "../hooks/use-update-lab-test";
import { LabResultsEditor } from "./lab-results-editor";
import {
  LabTestPriority,
  LabTestStatus,
  type LabTestDetail,
} from "@/types/lab-test";

interface LabTestFormDialogProps {
  open: boolean;
  onClose: () => void;
  visitId?: string;
  initialData?: LabTestDetail | null;
}

export function LabTestFormDialog({
  open,
  onClose,
  visitId,
  initialData,
}: LabTestFormDialogProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialData);
  const schema = useMemo(() => createLabTestSchema(t), [t]);
  const createMutation = useCreateLabTest();
  const updateMutation = useUpdateLabTest();
  const [status, setStatus] = useState<number>(LabTestStatus.Ordered);

  const form = useForm<LabTestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      visitId: "",
      testName: "",
      testCategory: "",
      priority: LabTestPriority.Normal,
      notes: "",
      results: [],
    },
  });

  useEffect(() => {
    if (open) {
      setStatus(initialData?.status ?? LabTestStatus.Ordered);
      if (initialData) {
        form.reset({
          visitId: initialData.visitId,
          testName: initialData.testName,
          testCategory: initialData.testCategory ?? "",
          priority: initialData.priority,
          notes: initialData.notes ?? "",
          results: initialData.results.map((r) => ({
            id: r.id,
            parameterName: r.parameterName,
            value: r.value ?? "",
            unit: r.unit ?? "",
            normalRange: r.normalRange ?? "",
            isAbnormal: r.isAbnormal,
            notes: r.notes ?? "",
          })),
        });
      } else {
        form.reset({
          visitId: visitId ?? "",
          testName: "",
          testCategory: "",
          priority: LabTestPriority.Normal,
          notes: "",
          results: [],
        });
      }
    }
  }, [open, visitId, initialData, form]);

  const onSubmit = (values: LabTestFormValues) => {
    const results = (values.results ?? []).map((r) => ({
      id: r.id || null,
      parameterName: r.parameterName,
      value: r.value || null,
      unit: r.unit || null,
      normalRange: r.normalRange || null,
      isAbnormal: r.isAbnormal,
      notes: r.notes || null,
    }));
    if (isEditing && initialData) {
      updateMutation.mutate(
        {
          id: initialData.id,
          data: {
            testName: values.testName,
            testCategory: values.testCategory || null,
            priority: Number(values.priority) as LabTestPriority,
            status: status as LabTestStatus,
            notes: values.notes || null,
            results,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          visitId: values.visitId,
          testName: values.testName,
          testCategory: values.testCategory || null,
          priority: Number(values.priority) as LabTestPriority,
          notes: values.notes || null,
          results: results.map(
            ({ parameterName, value, unit, normalRange, isAbnormal, notes }) => ({
              parameterName,
              value,
              unit,
              normalRange,
              isAbnormal,
              notes,
            }),
          ),
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("labTests.edit") : t("labTests.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isEditing && (
            <div className="space-y-2">
              <Label>{t("labTests.form.visitId")}</Label>
              <Input {...form.register("visitId")} className="h-10 tabular-nums" />
              {form.formState.errors.visitId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.visitId.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label>{t("labTests.form.testName")}</Label>
            <Input {...form.register("testName")} className="h-10" />
            {form.formState.errors.testName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.testName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("labTests.form.testCategory")}</Label>
              <Input {...form.register("testCategory")} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>{t("labTests.form.priority")}</Label>
              <Select
                value={String(form.watch("priority"))}
                onValueChange={(v) => form.setValue("priority", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("labTests.form.priority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(LabTestPriority.Routine)}>
                    {t("labTests.priority.routine")}
                  </SelectItem>
                  <SelectItem value={String(LabTestPriority.Normal)}>
                    {t("labTests.priority.normal")}
                  </SelectItem>
                  <SelectItem value={String(LabTestPriority.Urgent)}>
                    {t("labTests.priority.urgent")}
                  </SelectItem>
                  <SelectItem value={String(LabTestPriority.Stat)}>
                    {t("labTests.priority.stat")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isEditing && (
            <div className="space-y-2">
              <Label>{t("labTests.form.status")}</Label>
              <Select value={String(status)} onValueChange={(v) => setStatus(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder={t("labTests.form.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(LabTestStatus.Ordered)}>
                    {t("labTests.status.ordered")}
                  </SelectItem>
                  <SelectItem value={String(LabTestStatus.InProgress)}>
                    {t("labTests.status.inProgress")}
                  </SelectItem>
                  <SelectItem value={String(LabTestStatus.Completed)}>
                    {t("labTests.status.completed")}
                  </SelectItem>
                  <SelectItem value={String(LabTestStatus.Cancelled)}>
                    {t("labTests.status.cancelled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>{t("labTests.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>
          <LabResultsEditor form={form} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
