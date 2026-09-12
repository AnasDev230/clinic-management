"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useClinicProfile } from "../hooks/use-clinic-profile";
import { useUpdateClinicProfile } from "../hooks/use-update-clinic-profile";
import {
  createClinicProfileSchema,
  type ClinicProfileFormValues,
} from "../schemas/clinic-profile-schema";

function toTimeInput(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export function ClinicProfileForm() {
  const { t } = useTranslation();
  const profileQuery = useClinicProfile();
  const updateMutation = useUpdateClinicProfile();

  const form = useForm<ClinicProfileFormValues>({
    resolver: zodResolver(createClinicProfileSchema(t)),
    defaultValues: {
      name: "",
      logo: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      workingHoursStart: "09:00",
      workingHoursEnd: "21:00",
      about: "",
    },
  });

  useEffect(() => {
    const profile = profileQuery.data;
    if (profile) {
      form.reset({
        name: profile.name,
        logo: profile.logo ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        phone: profile.phone ?? "",
        email: profile.email ?? "",
        workingHoursStart: toTimeInput(profile.workingHoursStart),
        workingHoursEnd: toTimeInput(profile.workingHoursEnd),
        about: profile.about ?? "",
      });
    }
  }, [profileQuery.data, form]);

  if (profileQuery.isPending) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("toast.error.generic")}</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-2">
          <span>
            {getErrorMessage(profileQuery.error) || t("common.unexpectedError")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => profileQuery.refetch()}
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
          <Label htmlFor="clinic-name">{t("clinic.profile.name")} *</Label>
          <Input id="clinic-name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-logo">{t("clinic.profile.logo")}</Label>
          <Input
            id="clinic-logo"
            dir="ltr"
            placeholder="https://..."
            {...form.register("logo")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-phone">{t("clinic.profile.phone")}</Label>
          <Input id="clinic-phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-email">{t("clinic.profile.email")}</Label>
            <Input
              id="clinic-email"
              type="email"
              {...form.register("email")}
            />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-address">{t("clinic.profile.address")}</Label>
          <Input id="clinic-address" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-city">{t("clinic.profile.city")}</Label>
          <Input id="clinic-city" {...form.register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-start">
            {t("clinic.profile.workingHoursStart")}
          </Label>
            <Input
              id="clinic-start"
              type="time"
              {...form.register("workingHoursStart")}
            />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-end">
            {t("clinic.profile.workingHoursEnd")}
          </Label>
            <Input
              id="clinic-end"
              type="time"
              {...form.register("workingHoursEnd")}
            />
          {form.formState.errors.workingHoursEnd && (
            <p className="text-sm text-destructive">
              {form.formState.errors.workingHoursEnd.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="clinic-about">{t("clinic.profile.about")}</Label>
        <Textarea id="clinic-about" {...form.register("about")} />
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
