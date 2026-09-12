"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useCreatePatient } from "@/features/patients/hooks/use-create-patient";
import { PatientForm } from "@/features/patients/components/patient-form";
import type { PatientFormValues } from "@/features/patients/schemas/patient-schema";
import type { CreatePatientRequest } from "@/types/patient";

export default function NewPatientPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const createMutation = useCreatePatient();

  const handleSubmit = (values: PatientFormValues) => {
    const payload: CreatePatientRequest = {
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
    };
    createMutation.mutate(payload, {
      onSuccess: (created) => router.push(`/patients/${created.id}`),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("patients.new")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("patients.description")}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <PatientForm
            isPending={createMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/patients")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
