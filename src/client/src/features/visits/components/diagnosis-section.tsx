"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import type { DiagnosisItem } from "@/types/visit";
import { useDiagnoses } from "../hooks/use-diagnoses";
import { useDeleteDiagnosis } from "../hooks/use-delete-diagnosis";
import { DiagnosisFormDialog } from "./diagnosis-form-dialog";

export function DiagnosisSection({ visitId }: { visitId: string }) {
  const { t } = useTranslation();
  const diagnosesQuery = useDiagnoses(visitId);
  const deleteMutation = useDeleteDiagnosis();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DiagnosisItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiagnosisItem | null>(null);

  const items = diagnosesQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{t("diagnoses.title")}</CardTitle>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {t("diagnoses.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {diagnosesQuery.isPending && (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        )}
        {!diagnosesQuery.isPending && items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("diagnoses.empty")}</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{item.name}</p>
                {item.isPrimary && <Badge variant="default">{t("diagnoses.isPrimary")}</Badge>}
              </div>
              {item.code && (
                <p className="text-xs tabular-nums text-muted-foreground">{item.code}</p>
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
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

      <DiagnosisFormDialog
        visitId={visitId}
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
            { visitId, id: deleteTarget.id },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
      />
    </Card>
  );
}
