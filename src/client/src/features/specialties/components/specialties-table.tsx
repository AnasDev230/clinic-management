"use client";

import { Pencil, Search, Stethoscope, Trash2 } from "lucide-react";
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
import type { PagedResult } from "@/types/common";
import type { SpecialtyListItem } from "@/types/specialty";

export type SpecialtyFilter = "all" | "active" | "inactive";

interface SpecialtiesTableProps {
  data?: PagedResult<SpecialtyListItem>;
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
  onEdit: (item: SpecialtyListItem) => void;
  onDelete: (item: SpecialtyListItem) => void;
  onNew: () => void;
}

export function SpecialtiesTable({
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
  onEdit,
  onDelete,
  onNew,
}: SpecialtiesTableProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("specialties.search.placeholder")}
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
            <TableHead>{t("specialties.table.name")}</TableHead>
            <TableHead>{t("specialties.table.description")}</TableHead>
            <TableHead>{t("specialties.table.status")}</TableHead>
            <TableHead>{t("specialties.table.sortOrder")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ms-auto h-8 w-16" />
                </TableCell>
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Stethoscope className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">
                    {t("specialties.empty.title")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("specialties.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("specialties.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {item.description ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant={item.isActive ? "success" : "neutral"}>
                  {item.isActive
                    ? t("specialties.status.active")
                    : t("specialties.status.inactive")}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{item.sortOrder}</TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
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
