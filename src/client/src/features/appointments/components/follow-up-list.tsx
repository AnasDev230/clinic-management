"use client";

import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { FollowUpItem } from "@/types/appointment";
import { useFollowUps } from "../hooks/use-follow-ups";
import { useCompleteFollowUp } from "../hooks/use-complete-follow-up";
import { useDeleteFollowUp } from "../hooks/use-delete-follow-up";
import { FollowUpFormDialog } from "./follow-up-form-dialog";

interface FollowUpListProps {
  appointmentId: string;
}

export function FollowUpList({ appointmentId }: FollowUpListProps) {
  const { t, language } = useTranslation();
  const followUpsQuery = useFollowUps(appointmentId);
  const completeMutation = useCompleteFollowUp();
  const deleteMutation = useDeleteFollowUp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FollowUpItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FollowUpItem | null>(null);

  const items = followUpsQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{t("followUps.title")}</CardTitle>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {t("followUps.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {followUpsQuery.isPending && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {!followUpsQuery.isPending && items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("followUps.empty")}</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium tabular-nums">
                {formatDate(item.followUpDate, language)}
              </p>
              {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
              <Badge variant={item.isCompleted ? "success" : "warning"}>
                {item.isCompleted ? t("followUps.status.completed") : t("followUps.status.pending")}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {!item.isCompleted && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={completeMutation.isPending}
                  onClick={() =>
                    completeMutation.mutate({ appointmentId, id: item.id })
                  }
                  aria-label={t("followUps.complete")}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditing(item);
                  setFormOpen(true);
                }}
                aria-label={t("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteTarget(item)}
                aria-label={t("common.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <FollowUpFormDialog
        appointmentId={appointmentId}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        editing={editing}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.delete.title")}
        description={t("confirm.delete.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(
            { appointmentId, id: deleteTarget.id },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
      />
    </Card>
  );
}
