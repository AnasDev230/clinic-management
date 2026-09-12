"use client";

import { Eye, Pencil, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Gender, type PatientListItem } from "@/types/patient";
import type { SpecialtyFilter } from "@/features/specialties/components/specialties-table";

interface PatientsTableProps {
  data?: PagedResult<PatientListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  filter: SpecialtyFilter;
  onFilterChange: (value: SpecialtyFilter) => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: PatientListItem) => void;
  onEdit: (item: PatientListItem) => void;
  onDelete: (item: PatientListItem) => void;
  onNew: () => void;
}

export function PatientsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  searchInput,
  onSearchChange,
  filter,
  onFilterChange,
  page,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onNew,
}: PatientsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("patients.search.placeholder")}
            className="ps-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("specialties.filter.label")}
          </span>
          <Select
            value={filter}
            onValueChange={(value) => onFilterChange(value as SpecialtyFilter)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("specialties.filter.all")}</SelectItem>
              <SelectItem value="active">
                {t("specialties.filter.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("specialties.filter.inactive")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <TableHead>{t("patients.table.name")}</TableHead>
            <TableHead>{t("patients.table.dateOfBirth")}</TableHead>
            <TableHead>{t("patients.table.gender")}</TableHead>
            <TableHead>{t("patients.table.phone")}</TableHead>
            <TableHead>{t("patients.table.status")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    {t("patients.empty.title")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("patients.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("patients.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.fullName}</TableCell>
              <TableCell className="tabular-nums">
                {formatDate(item.dateOfBirth, language)}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    item.gender === Gender.Male
                      ? "border-sky-500/20 bg-sky-500/10 text-sky-600"
                      : "border-pink-500/20 bg-pink-500/10 text-pink-600"
                  }
                >
                  {item.gender === Gender.Male
                    ? t("enums.gender.male")
                    : t("enums.gender.female")}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{item.phone}</TableCell>
              <TableCell>
                <Badge variant={item.isActive ? "success" : "neutral"}>
                  {item.isActive
                    ? t("specialties.status.active")
                    : t("specialties.status.inactive")}
                </Badge>
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(item)}
                    aria-label={t("patients.detail")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    aria-label={t("common.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    aria-label={t("common.delete")}
                  >
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
