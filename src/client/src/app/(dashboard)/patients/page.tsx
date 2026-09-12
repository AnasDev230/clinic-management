"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { PatientsTable } from "@/features/patients/components/patients-table";
import { PatientDeleteDialog } from "@/features/patients/components/patient-delete-dialog";
import type { SpecialtyFilter } from "@/features/specialties/components/specialties-table";
import type { PatientListItem } from "@/types/patient";

export default function PatientsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SpecialtyFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<PatientListItem | null>(
    null,
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const patientsQuery = usePatients({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    isActive: filter === "all" ? undefined : filter === "active",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("patients.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("patients.description")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/patients/new")}>
          <Plus className="h-4 w-4" />
          {t("patients.new")}
        </Button>
      </div>

      <PatientsTable
        data={patientsQuery.data}
        isPending={patientsQuery.isPending}
        isError={patientsQuery.isError}
        error={patientsQuery.error}
        refetch={() => patientsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/patients/${item.id}`)}
        onEdit={(item) => router.push(`/patients/${item.id}`)}
        onDelete={setDeleteTarget}
        onNew={() => router.push("/patients/new")}
      />

      <PatientDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
