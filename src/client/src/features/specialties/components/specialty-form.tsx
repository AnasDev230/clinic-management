"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import {
  createSpecialtySchema,
  type SpecialtyFormValues,
} from "../schemas/specialty-schema";

export interface SpecialtyFormInitial {
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface SpecialtyFormProps {
  initial?: SpecialtyFormInitial | null;
  isPending: boolean;
  onSubmit: (values: SpecialtyFormValues) => void;
  onCancel: () => void;
}

export function SpecialtyForm({
  initial,
  isPending,
  onSubmit,
  onCancel,
}: SpecialtyFormProps) {
  const { t } = useTranslation();

  const form = useForm<SpecialtyFormValues>({
    resolver: zodResolver(createSpecialtySchema(t)),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      isActive: initial?.isActive ?? true,
      sortOrder: initial?.sortOrder ?? 0,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="specialty-name">{t("specialties.form.name")} *</Label>
          <Input id="specialty-name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty-order">
            {t("specialties.form.sortOrder")}
          </Label>
              <Input
                id="specialty-order"
                type="number"
                min={0}
                {...form.register("sortOrder")}
              />
          {form.formState.errors.sortOrder && (
            <p className="text-sm text-destructive">
              {form.formState.errors.sortOrder.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialty-description">
          {t("specialties.form.description")}
        </Label>
        <Textarea id="specialty-description" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-4">
        <Label htmlFor="specialty-active">
          {t("specialties.form.isActive")}
        </Label>
        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Switch
              id="specialty-active"
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
