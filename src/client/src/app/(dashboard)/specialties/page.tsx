"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useSpecialties } from "@/features/specialties/hooks/use-specialties";
import {
  SpecialtiesTable,
  type SpecialtyFilter,
} from "@/features/specialties/components/specialties-table";
import { SpecialtyDeleteDialog } from "@/features/specialties/components/specialty-delete-dialog";
import type { SpecialtyListItem } from "@/types/specialty";

export default function SpecialtiesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SpecialtyFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<SpecialtyListItem | null>(
    null,
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const specialtiesQuery = useSpecialties({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    isActive:
      filter === "all" ? undefined : filter === "active" ? true : false,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("specialties.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("specialties.description")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/specialties/new")}>
          <Plus className="h-4 w-4" />
          {t("specialties.new")}
        </Button>
      </div>

      <SpecialtiesTable
        data={specialtiesQuery.data}
        isPending={specialtiesQuery.isPending}
        isError={specialtiesQuery.isError}
        error={specialtiesQuery.error}
        refetch={() => specialtiesQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onEdit={(item) => router.push(`/specialties/${item.id}/edit`)}
        onDelete={setDeleteTarget}
        onNew={() => router.push("/specialties/new")}
      />

      <SpecialtyDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
