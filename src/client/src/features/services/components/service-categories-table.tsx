"use client";

import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import type { ServiceCategoryListItem } from "@/types/medical-service";

interface ServiceCategoriesTableProps {
  data?: ServiceCategoryListItem[];
  isPending: boolean;
  onEdit: (item: ServiceCategoryListItem) => void;
  onDelete: (item: ServiceCategoryListItem) => void;
  onNew: () => void;
}

export function ServiceCategoriesTable({
  data,
  isPending,
  onEdit,
  onDelete,
  onNew,
}: ServiceCategoriesTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow header>
          <TableHead>{t("services.categories.name")}</TableHead>
          <TableHead>{t("services.categories.description")}</TableHead>
          <TableHead>{t("services.categories.serviceCount")}</TableHead>
          <TableHead>{t("services.categories.status")}</TableHead>
          <TableHead className="text-end">{t("common.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 5 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {!isPending && (data?.length ?? 0) === 0 && (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{t("services.categories.empty.title")}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("services.categories.empty.description")}
                </p>
                <Button className="gap-2" onClick={onNew}>
                  {t("services.categories.new")}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="max-w-64 truncate text-muted-foreground">
              {item.description ?? "—"}
            </TableCell>
            <TableCell className="tabular-nums">{item.serviceCount}</TableCell>
            <TableCell>
              <Badge variant={item.isActive ? "success" : "neutral"}>
                {item.isActive ? t("specialties.status.active") : t("specialties.status.inactive")}
              </Badge>
            </TableCell>
            <TableCell className="text-end">
              <div className="flex items-center justify-end gap-1">
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
  );
}
