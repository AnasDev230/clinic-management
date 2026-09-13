"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { usePrescription } from "@/features/prescriptions/hooks/use-prescription";
import { useDeletePrescription } from "@/features/prescriptions/hooks/use-delete-prescription";
import { PrescriptionDetailSheet } from "@/features/prescriptions/components/prescription-detail-sheet";
import { PrescriptionFormDialog } from "@/features/prescriptions/components/prescription-form-dialog";
import { PrescriptionPrintView } from "@/features/prescriptions/components/prescription-print-view";

export default function PrescriptionDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const prescriptionQuery = usePrescription(id);
  const deleteMutation = useDeletePrescription();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("prescriptions.detail")}</h1>
          <p className="text-muted-foreground text-sm">
            {prescriptionQuery.data
              ? `${prescriptionQuery.data.patientName} - ${prescriptionQuery.data.doctorName}`
              : t("prescriptions.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {prescriptionQuery.data && (
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
          <Button variant="outline" className="gap-2" onClick={() => router.push("/prescriptions")}>
            {t("common.back")}
          </Button>
        </div>
      </div>

      {prescriptionQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {prescriptionQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(prescriptionQuery.error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/prescriptions")}>
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {prescriptionQuery.data && (
        <>
          <PrescriptionDetailSheet data={prescriptionQuery.data} onPrint={handlePrint} />
          <div className="hidden print:block">
            <PrescriptionPrintView ref={printRef} data={prescriptionQuery.data} />
          </div>
        </>
      )}

      <PrescriptionFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={prescriptionQuery.data ?? null}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("confirm.deletePrescription.title")}
        description={t("confirm.deletePrescription.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, { onSuccess: () => router.push("/prescriptions") });
        }}
      />
    </div>
  );
}
