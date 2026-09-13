"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { LabResultRow } from "./lab-result-row";

interface LabResultsEditorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

export function LabResultsEditor<T extends FieldValues>({
  form,
}: LabResultsEditorProps<T>) {
  const { t } = useTranslation();
  const results =
    (form.watch("results" as Path<T>) as unknown as Array<Record<string, unknown>>) ?? [];

  const addResult = () => {
    form.setValue(
      "results" as Path<T>,
      [
        ...results,
        {
          id: "",
          parameterName: "",
          value: "",
          unit: "",
          normalRange: "",
          isAbnormal: false,
          notes: "",
        },
      ] as never,
    );
  };

  const removeResult = (index: number) => {
    form.setValue(
      "results" as Path<T>,
      results.filter((_, i) => i !== index) as never,
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t("labTests.results.title")}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addResult}>
          <Plus className="h-4 w-4" />
          {t("labTests.results.add")}
        </Button>
      </div>
      {results.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("labTests.results.empty")}</p>
      )}
      {results.map((_, index) => (
        <LabResultRow
          key={index}
          form={form}
          index={index}
          onRemove={() => removeResult(index)}
        />
      ))}
    </div>
  );
}
