using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class DoctorSpecialtyConfiguration : IEntityTypeConfiguration<DoctorSpecialty>
{
    public void Configure(EntityTypeBuilder<DoctorSpecialty> builder)
    {
        builder.ToTable("doctor_specialties");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.DoctorId)
            .IsRequired();

        builder.Property(e => e.SpecialtyId)
            .IsRequired();

        builder.HasIndex(e => e.DoctorId);

        builder.HasIndex(e => e.SpecialtyId);

        builder.HasIndex(e => new { e.DoctorId, e.SpecialtyId })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");

        builder.HasOne(e => e.Specialty)
            .WithMany()
            .HasForeignKey(e => e.SpecialtyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
