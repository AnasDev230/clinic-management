"use client";

import { Mail, Phone, Award, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/translations/en";
import { useDoctor } from "../hooks/use-doctor";

const DAY_KEYS: TranslationKey[] = [
  "common.days.sunday",
  "common.days.monday",
  "common.days.tuesday",
  "common.days.wednesday",
  "common.days.thursday",
  "common.days.friday",
  "common.days.saturday",
];

function toTimeRange(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

interface DoctorDetailDialogProps {
  doctorId: string | null;
  onClose: () => void;
}

export function DoctorDetailDialog({ doctorId, onClose }: DoctorDetailDialogProps) {
  const { t } = useTranslation();
  const detailQuery = useDoctor(doctorId ?? "", doctorId !== null);
  const doctor = detailQuery.data;

  return (
    <Dialog open={doctorId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {doctor ? doctor.fullName : t("doctors.detail")}
          </DialogTitle>
          <DialogDescription>{t("doctors.description")}</DialogDescription>
        </DialogHeader>
        {detailQuery.isPending && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        )}
        {doctor && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-1">
              {doctor.specialties.map((s) => (
                <Badge key={s.specialtyId} variant="info">
                  {s.specialtyName}
                </Badge>
              ))}
              <Badge variant={doctor.isActive ? "success" : "neutral"}>
                {doctor.isActive
                  ? t("specialties.status.active")
                  : t("specialties.status.inactive")}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{t("doctors.detail.contact")}</p>
              <div className="space-y-1 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {doctor.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="tabular-nums">{doctor.phone}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>
                {t("doctors.detail.license")}:{" "}
                <span className="tabular-nums">{doctor.licenseNumber}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>
                {t("doctors.detail.experience")}:{" "}
                <span className="tabular-nums">
                  {doctor.yearsOfExperience}
                </span>{" "}
                {t("doctors.detail.years")}
              </span>
            </div>
            {doctor.bio && (
              <p className="text-muted-foreground">{doctor.bio}</p>
            )}
            {doctor.schedules.length > 0 && (
              <div className="space-y-1">
                <p className="font-medium">{t("doctors.form.schedules")}</p>
                {doctor.schedules.map((schedule) => (
                  <p
                    key={schedule.id}
                    className="flex items-center justify-between gap-2 text-muted-foreground"
                  >
                    <span>{t(DAY_KEYS[schedule.dayOfWeek] ?? "common.days.sunday")}</span>
                    <span className="tabular-nums">
                      {toTimeRange(schedule.startTime)} —{" "}
                      {toTimeRange(schedule.endTime)}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
