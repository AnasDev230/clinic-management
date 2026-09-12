"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useCreateSpecialty } from "@/features/specialties/hooks/use-create-specialty";
import { SpecialtyForm } from "@/features/specialties/components/specialty-form";
import type { SpecialtyFormValues } from "@/features/specialties/schemas/specialty-schema";

export default function NewSpecialtyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const createMutation = useCreateSpecialty();

  const handleSubmit = (values: SpecialtyFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => router.push("/specialties"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("specialties.new")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("specialties.description")}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <SpecialtyForm
            isPending={createMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/specialties")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
