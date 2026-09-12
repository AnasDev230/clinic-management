using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class PatientInsuranceConfiguration : IEntityTypeConfiguration<PatientInsurance>
{
    public void Configure(EntityTypeBuilder<PatientInsurance> builder)
    {
        builder.ToTable("patient_insurances");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.PatientId)
            .IsRequired();

        builder.Property(e => e.ProviderName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.PolicyNumber)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.GroupNumber)
            .HasMaxLength(100);

        builder.Property(e => e.ExpiryDate)
            .IsRequired();

        builder.Property(e => e.CoveragePercentage)
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasIndex(e => e.PatientId)
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");
    }
}
