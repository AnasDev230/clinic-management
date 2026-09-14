"use client";

import { useState } from "react";
import { Play, CheckCircle2, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { LabTestStatus, type LabTestDetail } from "@/types/lab-test";
import { LabTestStatusBadge } from "./lab-test-status-badge";
import { LabTestPriorityBadge } from "./lab-test-priority-badge";
import { LabResultsEditor } from "./lab-results-editor";
import { AttachmentsSection } from "@/features/attachments/components/attachments-section";
import { useStartLabTest } from "../hooks/use-start-lab-test";
import { useCompleteLabTest } from "../hooks/use-complete-lab-test";
import { useCancelLabTest } from "../hooks/use-cancel-lab-test";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createLabResultSchema } from "../schemas/lab-result-schema";

interface LabTestDetailPageProps {
  data: LabTestDetail;
}

export function LabTestDetailPage({ data }: LabTestDetailPageProps) {
  const { t, language } = useTranslation();
  const startMutation = useStartLabTest();
  const completeMutation = useCompleteLabTest();
  const cancelMutation = useCancelLabTest();
  const [completeOpen, setCompleteOpen] = useState(false);

  const isOrdered = data.status === LabTestStatus.Ordered;
  const isInProgress = data.status === LabTestStatus.InProgress;

  const resultSchema = z.object({
    results: z.array(createLabResultSchema(t)),
  });
  type CompleteFormValues = z.infer<typeof resultSchema>;
  const completeForm = useForm<CompleteFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: { results: [] },
  });

  const handleComplete = (values: CompleteFormValues) => {
    completeMutation.mutate(
      {
        id: data.id,
        results: values.results.map((r) => ({
          parameterName: r.parameterName,
          value: r.value || null,
          unit: r.unit || null,
          normalRange: r.normalRange || null,
          isAbnormal: r.isAbnormal,
          notes: r.notes || null,
        })),
      },
      { onSuccess: () => setCompleteOpen(false) },
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{data.testName}</CardTitle>
              <p className="text-sm text-muted-foreground tabular-nums">
                {data.patientName} · {data.orderedByDoctorName} ·{" "}
                {formatDate(data.orderedDate, language)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LabTestPriorityBadge priority={data.priority} />
              <LabTestStatusBadge status={data.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.testCategory && (
            <p className="text-sm text-muted-foreground">
              {t("labTests.table.category")}: {data.testCategory}
            </p>
          )}
          {data.notes && <p className="text-sm">{data.notes}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {isOrdered && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={startMutation.isPending}
                onClick={() => startMutation.mutate(data.id)}
              >
                <Play className="h-4 w-4" />
                {t("labTests.start")}
              </Button>
            )}
            {isInProgress && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  completeForm.reset({ results: [] });
                  setCompleteOpen(true);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("labTests.complete")}
              </Button>
            )}
            {(isOrdered || isInProgress) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate(data.id)}
              >
                <XCircle className="h-4 w-4" />
                {t("labTests.cancel")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("labTests.results.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                {t("labTests.results.empty")}
              </p>
              {isInProgress && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    completeForm.reset({ results: [] });
                    setCompleteOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t("labTests.results.add")}
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow header>
                  <TableHead>{t("labTests.results.parameter")}</TableHead>
                  <TableHead>{t("labTests.results.value")}</TableHead>
                  <TableHead>{t("labTests.results.unit")}</TableHead>
                  <TableHead>{t("labTests.results.normalRange")}</TableHead>
                  <TableHead>{t("labTests.results.notes")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.parameterName}</TableCell>
                    <TableCell
                      className={cn(
                        "tabular-nums",
                        r.isAbnormal && "font-medium text-red-600",
                      )}
                    >
                      {r.value ?? "—"}
                    </TableCell>
                    <TableCell>{r.unit ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">{r.normalRange ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.notes ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AttachmentsSection entityType="LabTest" entityId={data.id} />

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("labTests.complete")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={completeForm.handleSubmit(handleComplete)} className="space-y-4">
            <LabResultsEditor form={completeForm} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCompleteOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={completeMutation.isPending}>
                {completeMutation.isPending ? t("common.executing") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
