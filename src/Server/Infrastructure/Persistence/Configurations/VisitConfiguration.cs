using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class VisitConfiguration : IEntityTypeConfiguration<Visit>
{
    public void Configure(EntityTypeBuilder<Visit> builder)
    {
        builder.ToTable("visits");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.VisitDate)
            .IsRequired();

        builder.Property(e => e.ChiefComplaint)
            .HasMaxLength(1000);

        builder.Property(e => e.Symptoms)
            .HasMaxLength(2000);

        builder.Property(e => e.Diagnosis)
            .HasMaxLength(2000);

        builder.Property(e => e.TreatmentPlan)
            .HasMaxLength(2000);

        builder.Property(e => e.Notes)
            .HasMaxLength(2000);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.VisitStatus.Waiting);

        builder.Property(e => e.NextVisitRecommended)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(e => e.NextVisitNotes)
            .HasMaxLength(500);

        builder.Property(e => e.TotalAmount)
            .HasPrecision(15, 2)
            .HasDefaultValue(0m);

        builder.Property(e => e.DiscountAmount)
            .HasPrecision(15, 2)
            .HasDefaultValue(0m);

        builder.Property(e => e.FinalAmount)
            .HasPrecision(15, 2)
            .HasDefaultValue(0m);

        builder.HasIndex(e => e.AppointmentId)
            .IsUnique();

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.DoctorId);

        builder.HasIndex(e => e.VisitDate);

        builder.HasIndex(e => e.Status);

        builder.HasOne(e => e.Appointment)
            .WithOne()
            .HasForeignKey<Visit>(e => e.AppointmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Doctor)
            .WithMany()
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
