"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { ClinicProfileForm } from "@/features/clinic/components/clinic-profile-form";
import { ClinicSettingsForm } from "@/features/clinic/components/clinic-settings-form";

export default function ClinicPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("clinic.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("clinic.description")}
        </p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{t("clinic.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="settings">{t("clinic.tabs.settings")}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6">
              <ClinicProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <ClinicSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
