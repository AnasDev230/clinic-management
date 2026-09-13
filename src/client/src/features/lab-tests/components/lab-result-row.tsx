"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/use-translation";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface LabResultRowProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  index: number;
  onRemove: () => void;
}

export function LabResultRow<T extends FieldValues>({
  form,
  index,
  onRemove,
}: LabResultRowProps<T>) {
  const { t } = useTranslation();
  const errors = (
    form.formState.errors as unknown as {
      results?: Array<{ parameterName?: { message?: string } }>;
    }
  ).results;

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium tabular-nums">#{index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={t("labTests.results.remove")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>{t("labTests.results.parameter")}</Label>
          <Input
            {...form.register(`results.${index}.parameterName` as Path<T>)}
            className="h-10"
          />
          {errors?.[index]?.parameterName && (
            <p className="text-sm text-destructive">
              {errors[index]?.parameterName?.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("labTests.results.value")}</Label>
          <Input
            {...form.register(`results.${index}.value` as Path<T>)}
            className="h-10 tabular-nums"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("labTests.results.unit")}</Label>
          <Input
            {...form.register(`results.${index}.unit` as Path<T>)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("labTests.results.normalRange")}</Label>
          <Input
            {...form.register(`results.${index}.normalRange` as Path<T>)}
            className="h-10 tabular-nums"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("labTests.results.notes")}</Label>
          <Input
            {...form.register(`results.${index}.notes` as Path<T>)}
            className="h-10"
          />
        </div>
        <div className="flex items-center justify-between gap-2 md:col-span-2">
          <Label>{t("labTests.results.isAbnormal")}</Label>
          <Switch
            checked={Boolean(form.watch(`results.${index}.isAbnormal` as Path<T>))}
            onCheckedChange={(v) =>
              form.setValue(`results.${index}.isAbnormal` as Path<T>, v as never)
            }
          />
        </div>
      </div>
    </div>
  );
}
