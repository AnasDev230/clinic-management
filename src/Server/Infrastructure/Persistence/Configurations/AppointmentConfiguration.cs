using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("appointments");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.AppointmentDate)
            .IsRequired();

        builder.Property(e => e.StartTime)
            .IsRequired();

        builder.Property(e => e.EndTime)
            .IsRequired();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.AppointmentStatus.Scheduled);

        builder.Property(e => e.Type)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.AppointmentType.InPerson);

        builder.Property(e => e.Reason)
            .HasMaxLength(500);

        builder.Property(e => e.Notes)
            .HasMaxLength(2000);

        builder.Property(e => e.Priority)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.AppointmentPriority.Normal);

        builder.Property(e => e.DurationMinutes)
            .IsRequired()
            .HasDefaultValue(30);

        builder.Property(e => e.CancellationReason)
            .HasMaxLength(500);

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.DoctorId);

        builder.HasIndex(e => e.AppointmentDate);

        builder.HasIndex(e => e.Status);

        builder.HasIndex(e => new { e.DoctorId, e.AppointmentDate, e.StartTime });

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Doctor)
            .WithMany()
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Visit)
            .WithOne()
            .HasForeignKey<Appointment>(e => e.VisitId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
