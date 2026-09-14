"use client";

import {
  Bell,
  BellRing,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Clock,
  FlaskConical,
  Info,
  Pill,
  Receipt,
  Banknote,
  TriangleAlert,
} from "lucide-react";
import { NotificationType } from "@/types/notification";

export function NotificationTypeIcon({ type }: { type: NotificationType }) {
  const className = "h-5 w-5 shrink-0";
  switch (type) {
    case NotificationType.AppointmentReminder:
      return <CalendarClock className={className} />;
    case NotificationType.AppointmentCancelled:
      return <CalendarX className={className} />;
    case NotificationType.AppointmentCompleted:
      return <CalendarCheck className={className} />;
    case NotificationType.InvoiceIssued:
      return <Receipt className={className} />;
    case NotificationType.InvoiceOverdue:
      return <TriangleAlert className={className} />;
    case NotificationType.PaymentReceived:
      return <Banknote className={className} />;
    case NotificationType.LabResultReady:
      return <FlaskConical className={className} />;
    case NotificationType.PrescriptionReady:
      return <Pill className={className} />;
    case NotificationType.FollowUpDue:
      return <Clock className={className} />;
    case NotificationType.SystemAlert:
      return <Info className={className} />;
    default:
      return <Bell className={className} />;
  }
}

export function NotificationReminderIcon() {
  return <BellRing className="h-5 w-5 shrink-0" />;
}
