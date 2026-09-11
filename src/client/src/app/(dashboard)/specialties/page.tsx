"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function SpecialtiesPlaceholderPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("specialties.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("specialties.description")}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          {t("common.comingSoon")}
        </CardContent>
      </Card>
    </div>
  );
}
