"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type {
  MedicalServiceListItem,
  ServiceCategoryDropdown,
  ServiceCategoryListItem,
} from "@/types/medical-service";
import { useServiceCategories } from "@/features/services/hooks/use-service-categories";
import { useDeleteCategory } from "@/features/services/hooks/use-delete-category";
import { useMedicalServices } from "@/features/services/hooks/use-medical-services";
import { useDeleteService } from "@/features/services/hooks/use-delete-service";
import { ServiceCategoriesTable } from "@/features/services/components/service-categories-table";
import { MedicalServicesTable } from "@/features/services/components/medical-services-table";
import { CategoryFormDialog } from "@/features/services/components/category-form-dialog";
import { CategoryDeleteDialog } from "@/features/services/components/category-delete-dialog";
import { ServiceFormDialog } from "@/features/services/components/service-form-dialog";
import { ServiceDeleteDialog } from "@/features/services/components/service-delete-dialog";

export default function ServicesPage() {
  const { t } = useTranslation();

  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryEditTarget, setCategoryEditTarget] =
    useState<ServiceCategoryListItem | null>(null);
  const [categoryDeleteTarget, setCategoryDeleteTarget] =
    useState<ServiceCategoryListItem | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [serviceEditTarget, setServiceEditTarget] =
    useState<MedicalServiceListItem | null>(null);
  const [serviceDeleteTarget, setServiceDeleteTarget] =
    useState<MedicalServiceListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const categoriesQuery = useServiceCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const servicesQuery = useMedicalServices({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    categoryId: categoryFilter === "all" ? undefined : categoryFilter,
  });
  const deleteServiceMutation = useDeleteService();

  const dropdownCategories: ServiceCategoryDropdown[] = (
    categoriesQuery.data ?? []
  ).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("services.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("services.description")}</p>
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">{t("services.list.title")}</TabsTrigger>
          <TabsTrigger value="categories">{t("services.categories.title")}</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-end">
            <Button className="gap-2" onClick={() => setServiceFormOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("services.list.new")}
            </Button>
          </div>
          <MedicalServicesTable
            data={servicesQuery.data}
            isPending={servicesQuery.isPending}
            isError={servicesQuery.isError}
            error={servicesQuery.error}
            refetch={() => servicesQuery.refetch()}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            categoryFilter={categoryFilter}
            onCategoryChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
            categories={dropdownCategories}
            page={page}
            onPageChange={setPage}
            onEdit={setServiceEditTarget}
            onDelete={setServiceDeleteTarget}
            onNew={() => setServiceFormOpen(true)}
          />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-end">
            <Button className="gap-2" onClick={() => setCategoryFormOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("services.categories.new")}
            </Button>
          </div>
          <ServiceCategoriesTable
            data={categoriesQuery.data}
            isPending={categoriesQuery.isPending}
            onEdit={setCategoryEditTarget}
            onDelete={setCategoryDeleteTarget}
            onNew={() => setCategoryFormOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <CategoryFormDialog
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
      />
      <CategoryFormDialog
        open={categoryEditTarget !== null}
        onClose={() => setCategoryEditTarget(null)}
        initialData={categoryEditTarget}
      />
      <CategoryDeleteDialog
        target={categoryDeleteTarget}
        onClose={() => setCategoryDeleteTarget(null)}
        isLoading={deleteCategoryMutation.isPending}
        onConfirm={() => {
          if (!categoryDeleteTarget) return;
          deleteCategoryMutation.mutate(categoryDeleteTarget.id, {
            onSuccess: () => setCategoryDeleteTarget(null),
          });
        }}
      />

      <ServiceFormDialog
        open={serviceFormOpen}
        onClose={() => setServiceFormOpen(false)}
        categories={dropdownCategories}
        initialCategoryId={categoryFilter === "all" ? undefined : categoryFilter}
      />
      <ServiceFormDialog
        open={serviceEditTarget !== null}
        onClose={() => setServiceEditTarget(null)}
        categories={dropdownCategories}
        initialData={serviceEditTarget}
      />
      <ServiceDeleteDialog
        target={serviceDeleteTarget}
        onClose={() => setServiceDeleteTarget(null)}
        isLoading={deleteServiceMutation.isPending}
        onConfirm={() => {
          if (!serviceDeleteTarget) return;
          deleteServiceMutation.mutate(serviceDeleteTarget.id, {
            onSuccess: () => setServiceDeleteTarget(null),
          });
        }}
      />
    </div>
  );
}
