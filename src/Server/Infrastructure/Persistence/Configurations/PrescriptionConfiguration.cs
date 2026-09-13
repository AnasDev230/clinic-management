using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("prescriptions");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.PrescriptionDate)
            .IsRequired();

        builder.Property(e => e.Notes)
            .HasMaxLength(1000);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.PrescriptionStatus.Active);

        builder.HasIndex(e => e.VisitId);

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.DoctorId);

        builder.HasIndex(e => e.PrescriptionDate);

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
    }
}
