"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useSpecialty } from "@/features/specialties/hooks/use-specialty";
import { useUpdateSpecialty } from "@/features/specialties/hooks/use-update-specialty";
import { SpecialtyForm } from "@/features/specialties/components/specialty-form";
import type { SpecialtyFormValues } from "@/features/specialties/schemas/specialty-schema";

export default function EditSpecialtyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const specialtyQuery = useSpecialty(id);
  const updateMutation = useUpdateSpecialty();

  const handleSubmit = (values: SpecialtyFormValues) => {
    updateMutation.mutate(
      { id, data: values },
      { onSuccess: () => router.push("/specialties") },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("specialties.edit")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("specialties.description")}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {specialtyQuery.isPending && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          )}
          {specialtyQuery.isError && (
            <Alert variant="destructive">
              <AlertTitle>{t("toast.error.generic")}</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-2">
                <span>
                  {getErrorMessage(specialtyQuery.error) ||
                    t("common.unexpectedError")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/specialties")}
                >
                  {t("common.back")}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {specialtyQuery.data && (
            <SpecialtyForm
              key={specialtyQuery.data.id}
              initial={specialtyQuery.data}
              isPending={updateMutation.isPending}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/specialties")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
