"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useVisit } from "@/features/visits/hooks/use-visit";
import { VisitDetailPage } from "@/features/visits/components/visit-detail-page";
import { DiagnosisSection } from "@/features/visits/components/diagnosis-section";
import { VitalsSection } from "@/features/visits/components/vitals-section";
import { AttachmentsSection } from "@/features/attachments/components/attachments-section";

export default function VisitDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const visitQuery = useVisit(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("visits.detail")}</h1>
          <p className="text-muted-foreground text-sm">
            {visitQuery.data
              ? `${visitQuery.data.patientName} - ${visitQuery.data.doctorName}`
              : t("visits.description")}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/visits")}>
          {t("common.back")}
        </Button>
      </div>

      {visitQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {visitQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(visitQuery.error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/visits")}>
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {visitQuery.data && (
        <Tabs defaultValue="consultation">
          <TabsList>
            <TabsTrigger value="consultation">{t("visits.tabs.consultation")}</TabsTrigger>
            <TabsTrigger value="diagnoses">{t("visits.tabs.diagnoses")}</TabsTrigger>
            <TabsTrigger value="vitals">{t("visits.tabs.vitals")}</TabsTrigger>
            <TabsTrigger value="financial">{t("visits.tabs.financial")}</TabsTrigger>
            <TabsTrigger value="attachments">{t("visits.tabs.attachments")}</TabsTrigger>
          </TabsList>
          <TabsContent value="consultation">
            <VisitDetailPage visitId={id} />
          </TabsContent>
          <TabsContent value="diagnoses">
            <DiagnosisSection visitId={id} />
          </TabsContent>
          <TabsContent value="vitals">
            <VitalsSection visitId={id} />
          </TabsContent>
          <TabsContent value="financial">
            <VisitDetailPage visitId={id} />
          </TabsContent>
          <TabsContent value="attachments">
            <AttachmentsSection entityType="Visit" entityId={id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
