using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.DateOfBirth)
            .IsRequired();

        builder.Property(e => e.Gender)
            .IsRequired();

        builder.Property(e => e.Phone)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.Email)
            .HasMaxLength(255);

        builder.Property(e => e.Address)
            .HasMaxLength(500);

        builder.Property(e => e.City)
            .HasMaxLength(100);

        builder.Property(e => e.NationalId)
            .HasMaxLength(50);

        builder.Property(e => e.BloodType)
            .HasMaxLength(5);

        builder.Property(e => e.EmergencyContactName)
            .HasMaxLength(200);

        builder.Property(e => e.EmergencyContactPhone)
            .HasMaxLength(20);

        builder.Property(e => e.Notes)
            .HasMaxLength(2000);

        builder.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasIndex(e => e.Phone)
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");

        builder.HasIndex(e => e.NationalId);

        builder.HasIndex(e => e.IsActive);

        builder.HasMany(e => e.MedicalHistories)
            .WithOne(e => e.Patient)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Allergies)
            .WithOne(e => e.Patient)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Insurance)
            .WithOne(e => e.Patient)
            .HasForeignKey<PatientInsurance>(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
