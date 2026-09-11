"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function ClinicPlaceholderPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("clinic.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("clinic.description")}
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
