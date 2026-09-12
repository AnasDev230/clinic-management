"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";
import {
  DoctorsTable,
} from "@/features/doctors/components/doctors-table";
import { DoctorDetailDialog } from "@/features/doctors/components/doctor-detail-dialog";
import { DoctorDeleteDialog } from "@/features/doctors/components/doctor-delete-dialog";
import type { SpecialtyFilter } from "@/features/specialties/components/specialties-table";
import type { DoctorListItem } from "@/types/doctor";

export default function DoctorsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SpecialtyFilter>("all");
  const [specialtyId, setSpecialtyId] = useState<string | undefined>(undefined);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DoctorListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const doctorsQuery = useDoctors({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    isActive: filter === "all" ? undefined : filter === "active",
    specialtyId,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("doctors.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("doctors.description")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/doctors/new")}>
          <Plus className="h-4 w-4" />
          {t("doctors.new")}
        </Button>
      </div>

      <DoctorsTable
        data={doctorsQuery.data}
        isPending={doctorsQuery.isPending}
        isError={doctorsQuery.isError}
        error={doctorsQuery.error}
        refetch={() => doctorsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        specialtyId={specialtyId}
        onSpecialtyChange={(value) => {
          setSpecialtyId(value);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => setViewId(item.id)}
        onEdit={(item) => router.push(`/doctors/${item.id}/edit`)}
        onDelete={setDeleteTarget}
        onNew={() => router.push("/doctors/new")}
      />

      <DoctorDetailDialog doctorId={viewId} onClose={() => setViewId(null)} />
      <DoctorDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
