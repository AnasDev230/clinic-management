using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class ClinicSettingsConfiguration : IEntityTypeConfiguration<ClinicSettings>
{
    public void Configure(EntityTypeBuilder<ClinicSettings> builder)
    {
        builder.ToTable("clinic_settings");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.CurrencyCode)
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(e => e.TimeZone)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.AllowOnlineBooking)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(e => e.AppointmentDurationMinutes)
            .IsRequired();

        builder.Property(e => e.MaxPatientsPerDay)
            .IsRequired();
    }
}
