"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { AppointmentDetailSheet } from "@/features/appointments/components/appointment-detail-sheet";
import { AppointmentStatusActions } from "@/features/appointments/components/appointment-status-actions";
import { FollowUpList } from "@/features/appointments/components/follow-up-list";
import { AppointmentStatus } from "@/types/appointment";

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const appointmentQuery = useAppointment(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("appointments.detail")}</h1>
          <p className="text-muted-foreground text-sm">
            {appointmentQuery.data?.patientName ?? t("appointments.description")}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/appointments")}>
          {t("common.back")}
        </Button>
      </div>

      {appointmentQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {appointmentQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>
              {getErrorMessage(appointmentQuery.error) || t("common.unexpectedError")}
            </span>
            <Button variant="outline" size="sm" onClick={() => router.push("/appointments")}>
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {appointmentQuery.data && (
        <div className="space-y-4">
          <AppointmentDetailSheet appointment={appointmentQuery.data} isPending={false} />
          <Card>
            <CardContent className="pt-6">
              <AppointmentStatusActions
                id={appointmentQuery.data.id}
                status={appointmentQuery.data.status as AppointmentStatus}
              />
            </CardContent>
          </Card>
          <FollowUpList appointmentId={id} />
        </div>
      )}
    </div>
  );
}
