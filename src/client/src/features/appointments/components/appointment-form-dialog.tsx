"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { useDoctorsDropdown } from "@/features/doctors/hooks/use-doctors-dropdown";
import { usePatientsDropdown } from "@/features/patients/hooks/use-patients-dropdown";
import {
  AppointmentPriority,
  AppointmentStatus,
  AppointmentType,
  type AppointmentDetail,
} from "@/types/appointment";
import {
  createAppointmentSchema,
  type AppointmentFormValues,
} from "../schemas/appointment-schema";
import { useCreateAppointment } from "../hooks/use-create-appointment";
import { useUpdateAppointment } from "../hooks/use-update-appointment";

interface AppointmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  editing?: AppointmentDetail | null;
}

export function AppointmentFormDialog({ open, onClose, editing }: AppointmentFormDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createAppointmentSchema(t), [t]);
  const doctorsQuery = useDoctorsDropdown();
  const patientsQuery = usePatientsDropdown();
  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      type: AppointmentType.InPerson,
      reason: "",
      notes: "",
      priority: AppointmentPriority.Normal,
      durationMinutes: 30,
      status: AppointmentStatus.Scheduled,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        patientId: editing?.patientId ?? "",
        doctorId: editing?.doctorId ?? "",
        appointmentDate: editing?.appointmentDate.slice(0, 10) ?? "",
        startTime: editing?.startTime.slice(0, 5) ?? "",
        endTime: editing?.endTime.slice(0, 5) ?? "",
        type: editing?.type ?? AppointmentType.InPerson,
        reason: editing?.reason ?? "",
        notes: editing?.notes ?? "",
        priority: editing?.priority ?? AppointmentPriority.Normal,
        durationMinutes: editing?.durationMinutes ?? 30,
        status: editing?.status ?? AppointmentStatus.Scheduled,
      });
    }
  }, [open, editing, form]);

  const pending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: AppointmentFormValues) => {
    const toTimeSpan = (v: string) => (v.length === 5 ? `${v}:00` : v);
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          data: {
            patientId: values.patientId,
            doctorId: values.doctorId,
            appointmentDate: values.appointmentDate,
            startTime: toTimeSpan(values.startTime),
            endTime: toTimeSpan(values.endTime),
            type: Number(values.type) as AppointmentType,
            reason: values.reason || null,
            notes: values.notes || null,
            priority: Number(values.priority) as AppointmentPriority,
            durationMinutes: Number(values.durationMinutes),
            status: Number(values.status ?? editing.status) as AppointmentStatus,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          patientId: values.patientId,
          doctorId: values.doctorId,
          appointmentDate: values.appointmentDate,
          startTime: toTimeSpan(values.startTime),
          endTime: toTimeSpan(values.endTime),
          type: Number(values.type) as AppointmentType,
          reason: values.reason || null,
          notes: values.notes || null,
          priority: Number(values.priority) as AppointmentPriority,
          durationMinutes: Number(values.durationMinutes),
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? t("appointments.edit") : t("appointments.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("appointments.form.patient")}</Label>
              <Select
                value={form.watch("patientId")}
                onValueChange={(v) => form.setValue("patientId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("appointments.form.patient")} />
                </SelectTrigger>
                <SelectContent>
                  {(patientsQuery.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patientId && (
                <p className="text-sm text-destructive">{form.formState.errors.patientId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("appointments.form.doctor")}</Label>
              <Select
                value={form.watch("doctorId")}
                onValueChange={(v) => form.setValue("doctorId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("appointments.form.doctor")} />
                </SelectTrigger>
                <SelectContent>
                  {(doctorsQuery.data ?? []).map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.doctorId && (
                <p className="text-sm text-destructive">{form.formState.errors.doctorId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("appointments.form.date")}</Label>
              <Input type="date" {...form.register("appointmentDate")} className="h-10" />
              {form.formState.errors.appointmentDate && (
                <p className="text-sm text-destructive">{form.formState.errors.appointmentDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("appointments.form.startTime")}</Label>
              <Input type="time" {...form.register("startTime")} className="h-10" />
              {form.formState.errors.startTime && (
                <p className="text-sm text-destructive">{form.formState.errors.startTime.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("appointments.form.endTime")}</Label>
              <Input type="time" {...form.register("endTime")} className="h-10" />
              {form.formState.errors.endTime && (
                <p className="text-sm text-destructive">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("appointments.form.type")}</Label>
              <Select
                value={String(form.watch("type"))}
                onValueChange={(v) => form.setValue("type", Number(v) as AppointmentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(AppointmentType.InPerson)}>{t("appointments.type.inPerson")}</SelectItem>
                  <SelectItem value={String(AppointmentType.Phone)}>{t("appointments.type.phone")}</SelectItem>
                  <SelectItem value={String(AppointmentType.VideoCall)}>{t("appointments.type.videoCall")}</SelectItem>
                  <SelectItem value={String(AppointmentType.Emergency)}>{t("appointments.type.emergency")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("appointments.form.priority")}</Label>
              <Select
                value={String(form.watch("priority"))}
                onValueChange={(v) => form.setValue("priority", Number(v) as AppointmentPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(AppointmentPriority.Low)}>{t("appointments.priority.low")}</SelectItem>
                  <SelectItem value={String(AppointmentPriority.Normal)}>{t("appointments.priority.normal")}</SelectItem>
                  <SelectItem value={String(AppointmentPriority.High)}>{t("appointments.priority.high")}</SelectItem>
                  <SelectItem value={String(AppointmentPriority.Urgent)}>{t("appointments.priority.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("appointments.form.duration")}</Label>
              <Input type="number" {...form.register("durationMinutes")} className="h-10 tabular-nums" />
              {form.formState.errors.durationMinutes && (
                <p className="text-sm text-destructive">{form.formState.errors.durationMinutes.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("appointments.form.reason")}</Label>
            <Textarea {...form.register("reason")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t("appointments.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>

          {editing && (
            <div className="space-y-2">
              <Label>{t("appointments.form.status")}</Label>
              <Select
                value={String(form.watch("status"))}
                onValueChange={(v) => form.setValue("status", Number(v) as AppointmentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(AppointmentStatus.Scheduled)}>{t("appointments.status.scheduled")}</SelectItem>
                  <SelectItem value={String(AppointmentStatus.Confirmed)}>{t("appointments.status.confirmed")}</SelectItem>
                  <SelectItem value={String(AppointmentStatus.InProgress)}>{t("appointments.status.inProgress")}</SelectItem>
                  <SelectItem value={String(AppointmentStatus.Completed)}>{t("appointments.status.completed")}</SelectItem>
                  <SelectItem value={String(AppointmentStatus.Cancelled)}>{t("appointments.status.cancelled")}</SelectItem>
                  <SelectItem value={String(AppointmentStatus.NoShow)}>{t("appointments.status.noShow")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
