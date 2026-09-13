"use client";

import { Printer, CheckCircle2, XCircle } from "lucide-react";
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
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import { PrescriptionStatus, type PrescriptionDetail } from "@/types/prescription";
import { PrescriptionStatusBadge } from "./prescription-status-badge";
import { useCompletePrescription } from "../hooks/use-complete-prescription";
import { useCancelPrescription } from "../hooks/use-cancel-prescription";

interface PrescriptionDetailSheetProps {
  data: PrescriptionDetail;
  onPrint: () => void;
}

export function PrescriptionDetailSheet({ data, onPrint }: PrescriptionDetailSheetProps) {
  const { t, language } = useTranslation();
  const completeMutation = useCompletePrescription();
  const cancelMutation = useCancelPrescription();
  const isActive = data.status === PrescriptionStatus.Active;

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{data.patientName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.doctorName} · {formatDate(data.prescriptionDate, language)}
              </p>
            </div>
            <PrescriptionStatusBadge status={data.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.notes && <p className="text-sm">{data.notes}</p>}
          {data.validUntil && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {t("prescriptions.validUntil")}: {formatDate(data.validUntil, language)}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onPrint}>
              <Printer className="h-4 w-4" />
              {t("prescriptions.print")}
            </Button>
            {isActive && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={completeMutation.isPending}
                  onClick={() => completeMutation.mutate(data.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("prescriptions.complete")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(data.id)}
                >
                  <XCircle className="h-4 w-4" />
                  {t("prescriptions.cancel")}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("prescriptions.items.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>{t("prescriptions.items.medication")}</TableHead>
                <TableHead>{t("prescriptions.items.dosage")}</TableHead>
                <TableHead>{t("prescriptions.items.frequency")}</TableHead>
                <TableHead>{t("prescriptions.items.duration")}</TableHead>
                <TableHead>{t("prescriptions.items.instructions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.medicationName}</TableCell>
                  <TableCell>{item.dosage ?? "—"}</TableCell>
                  <TableCell>{item.frequency ?? "—"}</TableCell>
                  <TableCell>{item.duration ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.instructions ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
