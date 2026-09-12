"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { formatDate } from "@/lib/formatters";
import { usePatient } from "@/features/patients/hooks/use-patient";
import { useUpdatePatient } from "@/features/patients/hooks/use-update-patient";
import { PatientForm } from "@/features/patients/components/patient-form";
import { MedicalHistorySection } from "@/features/patients/components/medical-history-section";
import { AllergiesSection } from "@/features/patients/components/allergies-section";
import { InsuranceSection } from "@/features/patients/components/insurance-section";
import type { PatientFormValues } from "@/features/patients/schemas/patient-schema";
import { Gender, type PatientDetail } from "@/types/patient";
import type { UpdatePatientRequest } from "@/types/patient";

function BasicInfoTab({ patient }: { patient: PatientDetail }) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const updateMutation = useUpdatePatient();

  const handleSubmit = (values: PatientFormValues) => {
    const payload: UpdatePatientRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      phone: values.phone,
      email: values.email || null,
      address: values.address || null,
      city: values.city || null,
      nationalId: values.nationalId || null,
      bloodType: values.bloodType || null,
      emergencyContactName: values.emergencyContactName || null,
      emergencyContactPhone: values.emergencyContactPhone || null,
      notes: values.notes || null,
      isActive: values.isActive,
    };
    updateMutation.mutate({ id: patient.id, data: payload });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold">{patient.fullName}</h2>
        <Badge variant={patient.isActive ? "success" : "neutral"}>
          {patient.isActive
            ? t("specialties.status.active")
            : t("specialties.status.inactive")}
        </Badge>
        <Badge
          className={
            patient.gender === Gender.Male
              ? "border-sky-500/20 bg-sky-500/10 text-sky-600"
              : "border-pink-500/20 bg-pink-500/10 text-pink-600"
          }
        >
          {patient.gender === Gender.Male
            ? t("enums.gender.male")
            : t("enums.gender.female")}
        </Badge>
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatDate(patient.dateOfBirth, language)}
        </span>
      </div>
      <PatientForm
        key={patient.id + String(patient.updatedAt)}
        initial={patient}
        showActive
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/patients")}
      />
    </div>
  );
}

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const patientQuery = usePatient(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("patients.detail")}</h1>
          <p className="text-muted-foreground text-sm">
            {patientQuery.data?.fullName ?? t("patients.description")}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push("/patients")}
        >
          {t("common.back")}
        </Button>
      </div>

      {patientQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      )}

      {patientQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>
              {getErrorMessage(patientQuery.error) || t("common.unexpectedError")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/patients")}
            >
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {patientQuery.data && (
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">
              {t("patients.detail.tabs.basicInfo")}
            </TabsTrigger>
            <TabsTrigger value="history">
              {t("patients.detail.tabs.history")}
            </TabsTrigger>
            <TabsTrigger value="allergies">
              {t("patients.detail.tabs.allergies")}
            </TabsTrigger>
            <TabsTrigger value="insurance">
              {t("patients.detail.tabs.insurance")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <BasicInfoTab patient={patientQuery.data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <MedicalHistorySection
                  patientId={id}
                  items={patientQuery.data.medicalHistories}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="allergies">
            <Card>
              <CardContent className="pt-6">
                <AllergiesSection
                  patientId={id}
                  items={patientQuery.data.allergies}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="insurance">
            <Card>
              <CardContent className="pt-6">
                <InsuranceSection
                  patientId={id}
                  insurance={patientQuery.data.insurance}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
