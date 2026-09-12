"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useDoctor } from "@/features/doctors/hooks/use-doctor";
import { useUpdateDoctor } from "@/features/doctors/hooks/use-update-doctor";
import { DoctorForm } from "@/features/doctors/components/doctor-form";
import type { DoctorFormValues } from "@/features/doctors/schemas/doctor-schema";
import type { UpdateDoctorRequest } from "@/types/doctor";

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const doctorQuery = useDoctor(id);
  const updateMutation = useUpdateDoctor();

  const handleSubmit = (values: DoctorFormValues) => {
    const payload: UpdateDoctorRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      licenseNumber: values.licenseNumber,
      yearsOfExperience: values.yearsOfExperience,
      bio: values.bio || null,
      specialtyIds: values.specialtyIds,
      schedules: values.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      isActive: values.isActive,
    };
    updateMutation.mutate(
      { id, data: payload },
      { onSuccess: () => router.push("/doctors") },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("doctors.edit")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("doctors.description")}
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {doctorQuery.isPending && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {doctorQuery.isError && (
            <Alert variant="destructive">
              <AlertTitle>{t("toast.error.generic")}</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-2">
                <span>
                  {getErrorMessage(doctorQuery.error) ||
                    t("common.unexpectedError")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/doctors")}
                >
                  {t("common.back")}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {doctorQuery.data && (
            <DoctorForm
              key={doctorQuery.data.id}
              initial={doctorQuery.data}
              showActive
              isPending={updateMutation.isPending}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/doctors")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
