"use client";

import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { formatDate } from "@/lib/formatters";
import type { PagedResult } from "@/types/common";
import {
  AppointmentPriority,
  AppointmentStatus,
  AppointmentType,
  type AppointmentListItem,
} from "@/types/appointment";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { AppointmentPriorityBadge, AppointmentTypeBadge } from "./appointment-badges";
import { AppointmentStatusActions } from "./appointment-status-actions";

interface AppointmentsTableProps {
  data?: PagedResult<AppointmentListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: AppointmentListItem) => void;
  onEdit: (item: AppointmentListItem) => void;
  onCancel: (item: AppointmentListItem) => void;
  onDelete: (item: AppointmentListItem) => void;
  onNew: () => void;
}

export function AppointmentsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  page,
  onPageChange,
  onView,
  onEdit,
  onCancel,
  onDelete,
  onNew,
}: AppointmentsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("appointments.search.placeholder")}
            className="ps-9"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("appointments.filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("appointments.filter.allStatuses")}</SelectItem>
            <SelectItem value={String(AppointmentStatus.Scheduled)}>
              {t("appointments.status.scheduled")}
            </SelectItem>
            <SelectItem value={String(AppointmentStatus.Confirmed)}>
              {t("appointments.status.confirmed")}
            </SelectItem>
            <SelectItem value={String(AppointmentStatus.InProgress)}>
              {t("appointments.status.inProgress")}
            </SelectItem>
            <SelectItem value={String(AppointmentStatus.Completed)}>
              {t("appointments.status.completed")}
            </SelectItem>
            <SelectItem value={String(AppointmentStatus.Cancelled)}>
              {t("appointments.status.cancelled")}
            </SelectItem>
            <SelectItem value={String(AppointmentStatus.NoShow)}>
              {t("appointments.status.noShow")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              {t("common.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow header>
            <TableHead>{t("appointments.table.patient")}</TableHead>
            <TableHead>{t("appointments.table.doctor")}</TableHead>
            <TableHead>{t("appointments.table.date")}</TableHead>
            <TableHead>{t("appointments.table.time")}</TableHead>
            <TableHead>{t("appointments.table.type")}</TableHead>
            <TableHead>{t("appointments.table.priority")}</TableHead>
            <TableHead>{t("appointments.table.status")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <CalendarX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    {t("appointments.empty.title")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("appointments.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("appointments.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.patientName}</TableCell>
              <TableCell className="text-muted-foreground">{item.doctorName}</TableCell>
              <TableCell className="tabular-nums">
                {formatDate(item.appointmentDate, language)}
              </TableCell>
              <TableCell className="tabular-nums">
                {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
              </TableCell>
              <TableCell>
                <AppointmentTypeBadge type={item.type as AppointmentType} />
              </TableCell>
              <TableCell>
                <AppointmentPriorityBadge priority={item.priority as AppointmentPriority} />
              </TableCell>
              <TableCell>
                <AppointmentStatusBadge status={item.status as AppointmentStatus} />
              </TableCell>
              <TableCell className="text-end">
                <AppointmentStatusActions
                  id={item.id}
                  status={item.status as AppointmentStatus}
                  onView={() => onView(item)}
                  onEdit={() => onEdit(item)}
                  onCancel={() => onCancel(item)}
                  onDelete={() => onDelete(item)}
                  compact
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("common.page")} {data?.page} {t("common.of")} {data?.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data != null && page >= data.totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
