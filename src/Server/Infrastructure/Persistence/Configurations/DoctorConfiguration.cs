using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("doctors");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.Phone)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.LicenseNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.YearsOfExperience)
            .IsRequired();

        builder.Property(e => e.Bio)
            .HasMaxLength(1000);

        builder.Property(e => e.ProfileImage)
            .HasMaxLength(500);

        builder.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(e => e.ApplicationUserId)
            .IsRequired();

        builder.HasIndex(e => e.Email)
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");

        builder.HasIndex(e => e.LicenseNumber);

        builder.HasIndex(e => e.IsActive);

        builder.HasIndex(e => e.ApplicationUserId)
            .IsUnique();

        builder.HasOne(e => e.ApplicationUser)
            .WithOne()
            .HasForeignKey<Doctor>(e => e.ApplicationUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.DoctorSpecialties)
            .WithOne(e => e.Doctor)
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.DoctorSchedules)
            .WithOne(e => e.Doctor)
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
