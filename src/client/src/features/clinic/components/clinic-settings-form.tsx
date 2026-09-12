"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useClinicSettings } from "../hooks/use-clinic-settings";
import { useUpdateClinicSettings } from "../hooks/use-update-clinic-settings";
import {
  createClinicSettingsSchema,
  type ClinicSettingsFormValues,
} from "../schemas/clinic-settings-schema";

export function ClinicSettingsForm() {
  const { t } = useTranslation();
  const settingsQuery = useClinicSettings();
  const updateMutation = useUpdateClinicSettings();

  const form = useForm<ClinicSettingsFormValues>({
    resolver: zodResolver(createClinicSettingsSchema(t)),
    defaultValues: {
      currencyCode: "SYP",
      timeZone: "Asia/Damascus",
      allowOnlineBooking: true,
      appointmentDurationMinutes: 30,
      maxPatientsPerDay: 50,
    },
  });

  useEffect(() => {
    const settings = settingsQuery.data;
    if (settings) {
      form.reset({
        currencyCode: settings.currencyCode,
        timeZone: settings.timeZone,
        allowOnlineBooking: settings.allowOnlineBooking,
        appointmentDurationMinutes: settings.appointmentDurationMinutes,
        maxPatientsPerDay: settings.maxPatientsPerDay,
      });
    }
  }, [settingsQuery.data, form]);

  if (settingsQuery.isPending) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("toast.error.generic")}</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-2">
          <span>
            {getErrorMessage(settingsQuery.error) || t("common.unexpectedError")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => settingsQuery.refetch()}
          >
            {t("common.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="settings-currency">
            {t("clinic.settings.currencyCode")} *
          </Label>
            <Input
              id="settings-currency"
              maxLength={3}
              className="uppercase"
              {...form.register("currencyCode")}
            />
          {form.formState.errors.currencyCode && (
            <p className="text-sm text-destructive">
              {form.formState.errors.currencyCode.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-timezone">
            {t("clinic.settings.timeZone")} *
          </Label>
            <Input
              id="settings-timezone"
              placeholder="Asia/Damascus"
              {...form.register("timeZone")}
            />
          {form.formState.errors.timeZone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.timeZone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-duration">
            {t("clinic.settings.appointmentDurationMinutes")} *
          </Label>
            <Input
              id="settings-duration"
              type="number"
              min={1}
              {...form.register("appointmentDurationMinutes")}
            />
          {form.formState.errors.appointmentDurationMinutes && (
            <p className="text-sm text-destructive">
              {form.formState.errors.appointmentDurationMinutes.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-max">
            {t("clinic.settings.maxPatientsPerDay")} *
          </Label>
            <Input
              id="settings-max"
              type="number"
              min={1}
              {...form.register("maxPatientsPerDay")}
            />
          {form.formState.errors.maxPatientsPerDay && (
            <p className="text-sm text-destructive">
              {form.formState.errors.maxPatientsPerDay.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-4">
        <Label htmlFor="settings-booking">
          {t("clinic.settings.allowOnlineBooking")}
        </Label>
        <Controller
          control={form.control}
          name="allowOnlineBooking"
          render={({ field }) => (
            <Switch
              id="settings-booking"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={updateMutation.isPending}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          className="gap-2"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {updateMutation.isPending ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
