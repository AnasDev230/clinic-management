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
import { useTranslation } from "@/hooks/use-translation";
import {
  createCategorySchema,
  updateCategorySchema,
  type CategoryFormValues,
} from "../schemas/category-schema";
import { useCreateCategory } from "../hooks/use-create-category";
import { useUpdateCategory } from "../hooks/use-update-category";
import type { ServiceCategoryListItem } from "@/types/medical-service";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: ServiceCategoryListItem | null;
}

export function CategoryFormDialog({ open, onClose, initialData }: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialData);
  const schema = useMemo(
    () => (isEditing ? updateCategorySchema(t) : createCategorySchema(t)),
    [t, isEditing],
  );
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<CategoryFormValues & { isActive?: boolean }>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", sortOrder: 0, isActive: true },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        sortOrder: initialData?.sortOrder ?? 0,
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData, form]);

  const onSubmit = (values: CategoryFormValues & { isActive?: boolean }) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        {
          id: initialData.id,
          data: {
            name: values.name,
            description: values.description || null,
            sortOrder: values.sortOrder,
            isActive: values.isActive ?? true,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          description: values.description || null,
          sortOrder: values.sortOrder,
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("services.categories.edit") : t("services.categories.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("services.categories.name")}</Label>
            <Input {...form.register("name")} className="h-10" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("services.categories.description")}</Label>
            <Textarea {...form.register("description")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t("services.categories.sortOrder")}</Label>
            <Input type="number" {...form.register("sortOrder")} className="h-10 tabular-nums" />
          </div>
          {isEditing && (
            <div className="flex items-center justify-between gap-2">
              <Label>{t("services.categories.status")}</Label>
              <Switch
                checked={form.watch("isActive") ?? true}
                onCheckedChange={(v) => form.setValue("isActive", v)}
              />
            </div>
          )}
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
