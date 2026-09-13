using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class LabResultConfiguration : IEntityTypeConfiguration<LabResult>
{
    public void Configure(EntityTypeBuilder<LabResult> builder)
    {
        builder.ToTable("lab_results");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.ParameterName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Value)
            .HasMaxLength(100);

        builder.Property(e => e.Unit)
            .HasMaxLength(50);

        builder.Property(e => e.NormalRange)
            .HasMaxLength(100);

        builder.Property(e => e.IsAbnormal)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(e => e.Notes)
            .HasMaxLength(500);

        builder.Property(e => e.SortOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasIndex(e => e.LabTestId);

        builder.HasOne(e => e.LabTest)
            .WithMany(e => e.Results)
            .HasForeignKey(e => e.LabTestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
