"use client";

import { useEffect, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import {
  createServiceSchema,
  updateServiceSchema,
  type ServiceFormValues,
} from "../schemas/service-schema";
import { useCreateService } from "../hooks/use-create-service";
import { useUpdateService } from "../hooks/use-update-service";
import type {
  MedicalServiceListItem,
  ServiceCategoryDropdown,
} from "@/types/medical-service";

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  categories: ServiceCategoryDropdown[];
  initialData?: MedicalServiceListItem | null;
  initialCategoryId?: string;
}

export function ServiceFormDialog({
  open,
  onClose,
  categories,
  initialData,
  initialCategoryId,
}: ServiceFormDialogProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialData);
  const schema = useMemo(
    () => (isEditing ? updateServiceSchema(t) : createServiceSchema(t)),
    [t, isEditing],
  );
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const form = useForm<ServiceFormValues & { isActive?: boolean }>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      durationMinutes: 30,
      requiresAppointment: true,
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name ?? "",
        description: "",
        categoryId: initialCategoryId ?? "",
        price: initialData?.price ?? 0,
        durationMinutes: initialData?.durationMinutes ?? 30,
        requiresAppointment: true,
        sortOrder: 0,
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData, initialCategoryId, form]);

  const onSubmit = (values: ServiceFormValues & { isActive?: boolean }) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      categoryId: values.categoryId,
      price: values.price,
      durationMinutes: values.durationMinutes,
      requiresAppointment: values.requiresAppointment,
      sortOrder: values.sortOrder,
    };
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: { ...payload, isActive: values.isActive ?? true } },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("services.list.edit") : t("services.list.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("services.list.name")}</Label>
            <Input {...form.register("name")} className="h-10" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("services.list.category")}</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(v) => form.setValue("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("services.list.filter.category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.categoryId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("services.list.price")}</Label>
              <Input type="number" step="0.01" {...form.register("price")} className="h-10 tabular-nums" />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("services.list.duration")}</Label>
              <Input type="number" {...form.register("durationMinutes")} className="h-10 tabular-nums" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label>{t("services.list.requiresAppointment")}</Label>
            <Switch
              checked={form.watch("requiresAppointment")}
              onCheckedChange={(v) => form.setValue("requiresAppointment", v)}
            />
          </div>
          {isEditing && (
            <div className="flex items-center justify-between gap-2">
              <Label>{t("services.list.isActive")}</Label>
              <Switch
                checked={form.watch("isActive")}
                onCheckedChange={(v) => form.setValue("isActive", v)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>{t("services.list.description")}</Label>
            <Textarea {...form.register("description")} rows={2} />
          </div>
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
