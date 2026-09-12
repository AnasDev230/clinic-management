"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  createPatientSchema,
  type PatientFormValues,
} from "../schemas/patient-schema";
import { Gender, type PatientDetail } from "@/types/patient";

function toDateInput(value: string): string {
  return value.length >= 10 ? value.slice(0, 10) : value;
}

interface PatientFormProps {
  initial?: PatientDetail | null;
  showActive?: boolean;
  isPending: boolean;
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}

export function PatientForm({
  initial,
  showActive = false,
  isPending,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const { t } = useTranslation();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(createPatientSchema(t)),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      dateOfBirth: initial ? toDateInput(initial.dateOfBirth) : "",
      gender: initial?.gender ?? Gender.Male,
      phone: initial?.phone ?? "",
      email: initial?.email ?? "",
      address: initial?.address ?? "",
      city: initial?.city ?? "",
      nationalId: initial?.nationalId ?? "",
      bloodType: initial?.bloodType ?? "",
      emergencyContactName: initial?.emergencyContactName ?? "",
      emergencyContactPhone: initial?.emergencyContactPhone ?? "",
      notes: initial?.notes ?? "",
      isActive: initial?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patient-firstName">
            {t("patients.form.firstName")} *
          </Label>
          <Input id="patient-firstName" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-lastName">
            {t("patients.form.lastName")} *
          </Label>
          <Input id="patient-lastName" {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-dob">
            {t("patients.form.dateOfBirth")} *
          </Label>
          <Input id="patient-dob" type="date" {...form.register("dateOfBirth")} />
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {form.formState.errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-gender">{t("patients.form.gender")} *</Label>
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger id="patient-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(Gender.Male)}>
                    {t("enums.gender.male")}
                  </SelectItem>
                  <SelectItem value={String(Gender.Female)}>
                    {t("enums.gender.female")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-phone">{t("patients.form.phone")} *</Label>
          <Input id="patient-phone" {...form.register("phone")} />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-email">{t("patients.form.email")}</Label>
          <Input id="patient-email" type="email" {...form.register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-address">{t("patients.form.address")}</Label>
          <Input id="patient-address" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-city">{t("patients.form.city")}</Label>
          <Input id="patient-city" {...form.register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-nationalId">
            {t("patients.form.nationalId")}
          </Label>
          <Input id="patient-nationalId" {...form.register("nationalId")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-bloodType">
            {t("patients.form.bloodType")}
          </Label>
          <Input id="patient-bloodType" {...form.register("bloodType")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-emergencyName">
            {t("patients.form.emergencyContactName")}
          </Label>
          <Input
            id="patient-emergencyName"
            {...form.register("emergencyContactName")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-emergencyPhone">
            {t("patients.form.emergencyContactPhone")}
          </Label>
          <Input
            id="patient-emergencyPhone"
            {...form.register("emergencyContactPhone")}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-notes">{t("patients.form.notes")}</Label>
        <Textarea id="patient-notes" {...form.register("notes")} />
      </div>
      {showActive && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-4">
          <Label htmlFor="patient-active">{t("patients.form.isActive")}</Label>
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="patient-active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      )}
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" className="gap-2" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
