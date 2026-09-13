"use client";

import { FlaskConical, Eye, Pencil, Trash2, Search } from "lucide-react";
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
  LabTestPriority,
  LabTestStatus,
  type LabTestListItem,
} from "@/types/lab-test";
import { LabTestStatusBadge } from "./lab-test-status-badge";
import { LabTestPriorityBadge } from "./lab-test-priority-badge";

interface LabTestsTableProps {
  data?: PagedResult<LabTestListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: LabTestListItem) => void;
  onEdit: (item: LabTestListItem) => void;
  onDelete: (item: LabTestListItem) => void;
  onNew: () => void;
}

export function LabTestsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  page,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onNew,
}: LabTestsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("labTests.search.placeholder")}
            className="ps-9"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("labTests.filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("labTests.filter.allStatuses")}</SelectItem>
            <SelectItem value={String(LabTestStatus.Ordered)}>
              {t("labTests.status.ordered")}
            </SelectItem>
            <SelectItem value={String(LabTestStatus.InProgress)}>
              {t("labTests.status.inProgress")}
            </SelectItem>
            <SelectItem value={String(LabTestStatus.Completed)}>
              {t("labTests.status.completed")}
            </SelectItem>
            <SelectItem value={String(LabTestStatus.Cancelled)}>
              {t("labTests.status.cancelled")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("labTests.filter.priority")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("labTests.filter.allPriorities")}</SelectItem>
            <SelectItem value={String(LabTestPriority.Routine)}>
              {t("labTests.priority.routine")}
            </SelectItem>
            <SelectItem value={String(LabTestPriority.Normal)}>
              {t("labTests.priority.normal")}
            </SelectItem>
            <SelectItem value={String(LabTestPriority.Urgent)}>
              {t("labTests.priority.urgent")}
            </SelectItem>
            <SelectItem value={String(LabTestPriority.Stat)}>
              {t("labTests.priority.stat")}
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
            <TableHead>{t("labTests.table.testName")}</TableHead>
            <TableHead>{t("labTests.table.category")}</TableHead>
            <TableHead>{t("labTests.table.patient")}</TableHead>
            <TableHead>{t("labTests.table.orderedDate")}</TableHead>
            <TableHead>{t("labTests.table.priority")}</TableHead>
            <TableHead>{t("labTests.table.status")}</TableHead>
            <TableHead>{t("labTests.table.resultCount")}</TableHead>
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
                    <FlaskConical className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{t("labTests.empty.title")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("labTests.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("labTests.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.testName}</TableCell>
              <TableCell className="text-muted-foreground">
                {item.testCategory ?? "—"}
              </TableCell>
              <TableCell>{item.patientName}</TableCell>
              <TableCell className="tabular-nums">
                {formatDate(item.orderedDate, language)}
              </TableCell>
              <TableCell>
                <LabTestPriorityBadge priority={item.priority} />
              </TableCell>
              <TableCell>
                <LabTestStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="tabular-nums">{item.resultCount}</TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label={t("labTests.detail")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label={t("common.edit")}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item)} aria-label={t("common.delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
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
