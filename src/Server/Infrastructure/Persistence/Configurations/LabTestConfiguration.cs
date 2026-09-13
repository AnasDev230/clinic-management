using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class LabTestConfiguration : IEntityTypeConfiguration<LabTest>
{
    public void Configure(EntityTypeBuilder<LabTest> builder)
    {
        builder.ToTable("lab_tests");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.TestName)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.TestCategory)
            .HasMaxLength(200);

        builder.Property(e => e.OrderedDate)
            .IsRequired();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.LabTestStatus.Ordered);

        builder.Property(e => e.Priority)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.LabTestPriority.Normal);

        builder.Property(e => e.Notes)
            .HasMaxLength(1000);

        builder.HasIndex(e => e.VisitId);

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.OrderedDate);

        builder.HasIndex(e => e.Status);

        builder.HasOne(e => e.Visit)
            .WithMany()
            .HasForeignKey(e => e.VisitId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Doctor)
            .WithMany()
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.OrderedByDoctor)
            .WithMany()
            .HasForeignKey(e => e.OrderedByDoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.PerformedByDoctor)
            .WithMany()
            .HasForeignKey(e => e.PerformedByDoctorId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
