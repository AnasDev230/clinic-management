namespace Server.Infrastructure.Persistence.Entities.Enums;

public enum NotificationType
{
    AppointmentReminder = 0,
    AppointmentCancelled = 1,
    AppointmentCompleted = 2,
    InvoiceIssued = 3,
    InvoiceOverdue = 4,
    PaymentReceived = 5,
    LabResultReady = 6,
    PrescriptionReady = 7,
    FollowUpDue = 8,
    SystemAlert = 9
}
