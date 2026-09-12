"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { useSpecialtiesDropdown } from "@/features/specialties/hooks/use-specialties-dropdown";
import { ScheduleEditor } from "./schedule-editor";
import {
  createDoctorSchema,
  type DoctorFormValues,
} from "../schemas/doctor-schema";
import type { DoctorDetail } from "@/types/doctor";

function toTimeInput(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

interface DoctorFormProps {
  initial?: DoctorDetail | null;
  showActive?: boolean;
  isPending: boolean;
  onSubmit: (values: DoctorFormValues) => void;
  onCancel: () => void;
}

export function DoctorForm({
  initial,
  showActive = false,
  isPending,
  onSubmit,
  onCancel,
}: DoctorFormProps) {
  const { t } = useTranslation();
  const specialtiesQuery = useSpecialtiesDropdown();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(createDoctorSchema(t)),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      licenseNumber: initial?.licenseNumber ?? "",
      yearsOfExperience: initial?.yearsOfExperience ?? 0,
      bio: initial?.bio ?? "",
      specialtyIds:
        initial?.specialties.map((s) => s.specialtyId) ?? [],
      schedules:
        initial?.schedules.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: toTimeInput(s.startTime),
          endTime: toTimeInput(s.endTime),
        })) ?? [],
      isActive: initial?.isActive ?? true,
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="doctor-firstName">
              {t("doctors.form.firstName")} *
            </Label>
            <Input id="doctor-firstName" {...form.register("firstName")} />
            {form.formState.errors.firstName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-lastName">
              {t("doctors.form.lastName")} *
            </Label>
            <Input id="doctor-lastName" {...form.register("lastName")} />
            {form.formState.errors.lastName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-email">{t("doctors.form.email")} *</Label>
            <Input id="doctor-email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-phone">{t("doctors.form.phone")} *</Label>
            <Input id="doctor-phone" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-license">
              {t("doctors.form.licenseNumber")} *
            </Label>
            <Input id="doctor-license" {...form.register("licenseNumber")} />
            {form.formState.errors.licenseNumber && (
              <p className="text-sm text-destructive">
                {form.formState.errors.licenseNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-years">
              {t("doctors.form.yearsOfExperience")}
            </Label>
            <Input
              id="doctor-years"
              type="number"
              min={0}
              {...form.register("yearsOfExperience")}
            />
            {form.formState.errors.yearsOfExperience && (
              <p className="text-sm text-destructive">
                {form.formState.errors.yearsOfExperience.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctor-bio">{t("doctors.form.bio")}</Label>
          <Textarea id="doctor-bio" {...form.register("bio")} />
        </div>
        <div className="space-y-2">
          <Label>{t("doctors.form.specialties")} *</Label>
          {specialtiesQuery.isPending && (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28" />
              ))}
            </div>
          )}
          <Controller
            control={form.control}
            name="specialtyIds"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {(specialtiesQuery.data ?? []).map((specialty) => {
                  const checked = field.value.includes(specialty.id);
                  return (
                    <label
                      key={specialty.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/30 has-checked:border-primary has-checked:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={checked}
                        onChange={(e) => {
                          field.onChange(
                            e.target.checked
                              ? [...field.value, specialty.id]
                              : field.value.filter(
                                  (id: string) => id !== specialty.id,
                                ),
                          );
                        }}
                      />
                      {specialty.name}
                    </label>
                  );
                })}
              </div>
            )}
          />
          {form.formState.errors.specialtyIds && (
            <p className="text-sm text-destructive">
              {form.formState.errors.specialtyIds.message}
            </p>
          )}
        </div>
        <ScheduleEditor />
        {showActive && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-4">
            <Label htmlFor="doctor-active">
              {t("doctors.form.isActive")}
            </Label>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="doctor-active"
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
    </FormProvider>
  );
}
