"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { useVitals } from "../hooks/use-vitals";
import { VitalsForm } from "./vitals-form";

export function VitalsSection({ visitId }: { visitId: string }) {
  const { t } = useTranslation();
  const vitalsQuery = useVitals(visitId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("vitals.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!vitalsQuery.isPending && !vitalsQuery.data && (
          <p className="text-sm text-muted-foreground">{t("vitals.empty")}</p>
        )}
        {vitalsQuery.isPending && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!vitalsQuery.isPending && (
          <VitalsForm
            visitId={visitId}
            initialValues={{
              temperature: vitalsQuery.data?.temperature ?? null,
              bloodPressureSystolic: vitalsQuery.data?.bloodPressureSystolic ?? null,
              bloodPressureDiastolic: vitalsQuery.data?.bloodPressureDiastolic ?? null,
              heartRate: vitalsQuery.data?.heartRate ?? null,
              respiratoryRate: vitalsQuery.data?.respiratoryRate ?? null,
              oxygenSaturation: vitalsQuery.data?.oxygenSaturation ?? null,
              weight: vitalsQuery.data?.weight ?? null,
              height: vitalsQuery.data?.height ?? null,
              notes: vitalsQuery.data?.notes ?? "",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
