"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/translations/en";
import type { DoctorFormValues } from "../schemas/doctor-schema";

const DAY_KEYS: TranslationKey[] = [
  "common.days.sunday",
  "common.days.monday",
  "common.days.tuesday",
  "common.days.wednesday",
  "common.days.thursday",
  "common.days.friday",
  "common.days.saturday",
];

function toInput(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export function ScheduleEditor() {
  const { t } = useTranslation();
  const { control, setValue, register, formState } = useFormContext<DoctorFormValues>();
  const schedules = useWatch({ control, name: "schedules" }) ?? [];

  const toggleDay = (day: number, enabled: boolean) => {
    if (enabled) {
      setValue(
        "schedules",
        [...schedules, { dayOfWeek: day, startTime: "09:00", endTime: "17:00" }],
        { shouldValidate: true },
      );
    } else {
      setValue(
        "schedules",
        schedules.filter((s) => s.dayOfWeek !== day),
        { shouldValidate: true },
      );
    }
  };

  return (
    <div className="space-y-2">
      <Label>{t("doctors.form.schedules")}</Label>
      <div className="space-y-2 rounded-lg border border-border p-4">
        {DAY_KEYS.map((dayKey, day) => {
          const index = schedules.findIndex((s) => s.dayOfWeek === day);
          const enabled = index >= 0;
          const dayError =
            enabled && Array.isArray(formState.errors.schedules)
              ? (formState.errors.schedules[index] as { message?: string } | undefined)
              : undefined;
          return (
            <div key={day} className="space-y-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => toggleDay(day, checked)}
                  aria-label={t(dayKey)}
                />
                <span className="w-24 text-sm font-medium">{t(dayKey)}</span>
                {enabled && (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="time"
                      aria-label={t("doctors.schedule.start")}
                      {...register(`schedules.${index}.startTime`)}
                      defaultValue={toInput(schedules[index]?.startTime ?? "09:00")}
                    />
                    <span className="text-sm text-muted-foreground">—</span>
                    <Input
                      type="time"
                      aria-label={t("doctors.schedule.end")}
                      {...register(`schedules.${index}.endTime`)}
                      defaultValue={toInput(schedules[index]?.endTime ?? "17:00")}
                    />
                  </div>
                )}
              </div>
              {typeof dayError?.message === "string" && (
                <p className="text-sm text-destructive">{dayError.message}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
