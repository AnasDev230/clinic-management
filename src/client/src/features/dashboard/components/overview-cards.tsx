"use client";

import { AlertTriangle, CalendarDays, Users, Wallet } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardOverview } from "@/types/dashboard";
import { StatCard } from "./stat-card";

interface OverviewCardsProps {
  data?: DashboardOverview;
  isPending: boolean;
}

export function OverviewCards({ data, isPending }: OverviewCardsProps) {
  const { t, language } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("dashboard.totalPatients")}
        value={data?.totalPatients ?? 0}
        icon={Users}
        isPending={isPending}
      />
      <StatCard
        title={t("dashboard.todayAppointments")}
        value={data?.todayAppointments ?? 0}
        icon={CalendarDays}
        isPending={isPending}
      />
      <StatCard
        title={t("dashboard.todayRevenue")}
        value={data ? formatCurrency(data.todayRevenue, language) : "—"}
        icon={Wallet}
        variant="success"
        isPending={isPending}
      />
      <StatCard
        title={t("dashboard.overdueInvoices")}
        value={data?.overdueInvoices ?? 0}
        icon={AlertTriangle}
        variant={data && data.overdueInvoices > 0 ? "danger" : "default"}
        isPending={isPending}
      />
    </div>
  );
}
