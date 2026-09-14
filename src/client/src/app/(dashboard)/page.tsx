"use client";

import { useMemo } from "react";
import { FlaskConical, HeartPulse, Pill, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import { useAuthStore } from "@/stores/auth-store";
import { AppointmentsStatusChart } from "@/features/dashboard/components/appointments-status-chart";
import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { PatientsGrowthChart } from "@/features/dashboard/components/patients-growth-chart";
import { RecentActivityWidget } from "@/features/dashboard/components/recent-activity-widget";
import { RevenueWidget } from "@/features/dashboard/components/revenue-widget";
import { TodayAppointmentsWidget } from "@/features/dashboard/components/today-appointments-widget";
import { TopDoctorsWidget } from "@/features/dashboard/components/top-doctors-widget";
import { WeeklyChart } from "@/features/dashboard/components/weekly-chart";
import { useAppointmentsByStatus } from "@/features/dashboard/hooks/use-appointments-by-status";
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import { useMonthlyStats } from "@/features/dashboard/hooks/use-monthly-stats";
import { usePatientsGrowth } from "@/features/dashboard/hooks/use-patients-growth";
import { useRecentActivity } from "@/features/dashboard/hooks/use-recent-activity";
import { useRevenueSummary } from "@/features/dashboard/hooks/use-revenue-summary";
import { useTodaySummary } from "@/features/dashboard/hooks/use-today-summary";
import { useTopDoctors } from "@/features/dashboard/hooks/use-top-doctors";
import { useWeeklyStats } from "@/features/dashboard/hooks/use-weekly-stats";

function useIsFinancialHidden() {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];
  if (roles.length === 0) return false;
  return (
    roles.includes("Doctor") &&
    !roles.includes("Admin") &&
    !roles.includes("SuperAdmin")
  );
}

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const hideFinancials = useIsFinancialHidden();

  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const statusTo = useMemo(() => now.toISOString(), [now]);
  const statusFrom = useMemo(
    () => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    [now],
  );

  const overviewQuery = useDashboardOverview();
  const todayQuery = useTodaySummary();
  const weeklyQuery = useWeeklyStats(true);
  const revenueQuery = useRevenueSummary(year, month, !hideFinancials);
  const topDoctorsQuery = useTopDoctors(year, month, 5, !hideFinancials);
  const statusQuery = useAppointmentsByStatus(statusFrom, statusTo, true);
  const growthQuery = usePatientsGrowth(6, !hideFinancials);
  const activityQuery = useRecentActivity(10, !hideFinancials);
  const monthlyQuery = useMonthlyStats(year, month, !hideFinancials);

  const monthStats = useMemo(
    () => [
      {
        label: t("dashboard.month.visits"),
        value: formatNumber(monthlyQuery.data?.totalVisits ?? 0, language),
        Icon: HeartPulse,
      },
      {
        label: t("dashboard.month.labTests"),
        value: formatNumber(monthlyQuery.data?.totalLabTests ?? 0, language),
        Icon: FlaskConical,
      },
      {
        label: t("dashboard.month.prescriptions"),
        value: formatNumber(monthlyQuery.data?.totalPrescriptions ?? 0, language),
        Icon: Pill,
      },
      {
        label: t("dashboard.month.newPatients"),
        value: formatNumber(monthlyQuery.data?.newPatients ?? 0, language),
        Icon: UserPlus,
      },
    ],
    [monthlyQuery.data, t, language],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("dashboard.description")}
          </p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {formatDate(now, language)}
        </p>
      </div>

      <OverviewCards data={overviewQuery.data} isPending={overviewQuery.isPending} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <WeeklyChart data={weeklyQuery.data} isPending={weeklyQuery.isPending} />
        <TodayAppointmentsWidget
          items={todayQuery.data?.upcomingAppointments ?? []}
          isPending={todayQuery.isPending}
        />
      </div>

      {!hideFinancials && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RevenueWidget data={revenueQuery.data} isPending={revenueQuery.isPending} />
          <TopDoctorsWidget
            data={topDoctorsQuery.data ?? []}
            isPending={topDoctorsQuery.isPending}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppointmentsStatusChart
          data={statusQuery.data ?? []}
          isPending={statusQuery.isPending}
        />
        {!hideFinancials && (
          <RecentActivityWidget
            data={activityQuery.data ?? []}
            isPending={activityQuery.isPending}
          />
        )}
      </div>

      {!hideFinancials && (
        <>
          <PatientsGrowthChart
            data={growthQuery.data}
            isPending={growthQuery.isPending}
          />
          <Card>
            <CardContent className="grid grid-cols-2 gap-2 p-5 lg:grid-cols-4">
              {monthlyQuery.isPending
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2 rounded-md border border-border p-3">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))
                : monthStats.map(({ label, value, Icon }) => (
                    <div
                      key={label}
                      className="rounded-md border border-border p-3"
                    >
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </>
      )}

      {!hideFinancials && monthlyQuery.data && (
        <p className="text-center text-xs text-muted-foreground tabular-nums">
          {t("dashboard.time.thisMonth")}:{" "}
          {formatCurrency(monthlyQuery.data.totalRevenue, language)}
        </p>
      )}
    </div>
  );
}
