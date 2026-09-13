"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useLabTest } from "@/features/lab-tests/hooks/use-lab-test";
import { useDeleteLabTest } from "@/features/lab-tests/hooks/use-delete-lab-test";
import { LabTestDetailPage } from "@/features/lab-tests/components/lab-test-detail-page";
import { LabTestFormDialog } from "@/features/lab-tests/components/lab-test-form-dialog";

export default function LabTestDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const labTestQuery = useLabTest(id);
  const deleteMutation = useDeleteLabTest();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("labTests.detail")}</h1>
          <p className="text-muted-foreground text-sm">
            {labTestQuery.data
              ? `${labTestQuery.data.testName} - ${labTestQuery.data.patientName}`
              : t("labTests.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {labTestQuery.data && (
            <>
              <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                {t("common.edit")}
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                {t("common.delete")}
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2" onClick={() => router.push("/lab-tests")}>
            {t("common.back")}
          </Button>
        </div>
      </div>

      {labTestQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {labTestQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(labTestQuery.error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/lab-tests")}>
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {labTestQuery.data && <LabTestDetailPage data={labTestQuery.data} />}

      <LabTestFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={labTestQuery.data ?? null}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("confirm.deleteLabTest.title")}
        description={t("confirm.deleteLabTest.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, { onSuccess: () => router.push("/lab-tests") });
        }}
      />
    </div>
  );
}
