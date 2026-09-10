using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class ClinicProfileConfiguration : IEntityTypeConfiguration<ClinicProfile>
{
    public void Configure(EntityTypeBuilder<ClinicProfile> builder)
    {
        builder.ToTable("clinic_profiles");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Logo)
            .HasMaxLength(500);

        builder.Property(e => e.Address)
            .HasMaxLength(500);

        builder.Property(e => e.City)
            .HasMaxLength(100);

        builder.Property(e => e.Phone)
            .HasMaxLength(20);

        builder.Property(e => e.Email)
            .HasMaxLength(200);

        builder.Property(e => e.WorkingHoursStart)
            .IsRequired();

        builder.Property(e => e.WorkingHoursEnd)
            .IsRequired();

        builder.Property(e => e.About)
            .HasMaxLength(1000);
    }
}
