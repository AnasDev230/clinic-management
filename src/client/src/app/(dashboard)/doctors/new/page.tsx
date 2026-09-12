"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { useCreateDoctor } from "@/features/doctors/hooks/use-create-doctor";
import { DoctorForm } from "@/features/doctors/components/doctor-form";
import type { DoctorFormValues } from "@/features/doctors/schemas/doctor-schema";
import type { CreateDoctorRequest } from "@/types/doctor";

export default function NewDoctorPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const createMutation = useCreateDoctor();
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const handleSubmit = (values: DoctorFormValues) => {
    const payload: CreateDoctorRequest = {
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
    };
    createMutation.mutate(payload, {
      onSuccess: (created) => {
        if (created.temporaryPassword) {
          setTemporaryPassword(created.temporaryPassword);
        } else {
          router.push("/doctors");
        }
      },
    });
  };

  const handleCopy = async () => {
    if (!temporaryPassword) return;
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("doctors.new")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("doctors.description")}
        </p>
      </div>
      {temporaryPassword && (
        <Alert variant="info">
          <AlertTitle>{t("doctors.tempPassword.title")}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{t("doctors.tempPassword.description")}</p>
            <div className="flex items-center gap-2">
              <code
                className="rounded-md bg-background px-3 py-2 font-mono text-sm tabular-nums"
                dir="ltr"
              >
                {temporaryPassword}
              </code>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {t("doctors.tempPassword.copied")}
              </Button>
              <Button size="sm" onClick={() => router.push("/doctors")}>
                {t("common.back")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardContent className="pt-6">
          <DoctorForm
            isPending={createMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/doctors")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
