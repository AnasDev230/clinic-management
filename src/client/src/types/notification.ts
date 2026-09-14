export enum NotificationType {
  AppointmentReminder = 0,
  AppointmentCancelled = 1,
  AppointmentCompleted = 2,
  InvoiceIssued = 3,
  InvoiceOverdue = 4,
  PaymentReceived = 5,
  LabResultReady = 6,
  PrescriptionReady = 7,
  FollowUpDue = 8,
  SystemAlert = 9,
}

export enum NotificationPriority {
  Low = 0,
  Normal = 1,
  High = 2,
  Urgent = 3,
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
}

export interface NotificationDetail extends NotificationItem {
  readAt?: string | null;
  actionUrl?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export interface UnreadCount {
  count: number;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}
