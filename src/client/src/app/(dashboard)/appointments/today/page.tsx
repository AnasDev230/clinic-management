"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useTodayAppointments } from "@/features/appointments/hooks/use-today-appointments";
import { TodayScheduleView } from "@/features/appointments/components/today-schedule-view";

export default function TodayAppointmentsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const todayQuery = useTodayAppointments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("appointments.today.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("appointments.today.description")}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/appointments")}>
          {t("common.back")}
        </Button>
      </div>

      <TodayScheduleView
        data={todayQuery.data}
        isPending={todayQuery.isPending}
        isError={todayQuery.isError}
        error={todayQuery.error}
        refetch={() => todayQuery.refetch()}
        onView={(item) => router.push(`/appointments/${item.id}`)}
      />
    </div>
  );
}
