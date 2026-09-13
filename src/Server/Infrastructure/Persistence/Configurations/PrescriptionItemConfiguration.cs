using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class PrescriptionItemConfiguration : IEntityTypeConfiguration<PrescriptionItem>
{
    public void Configure(EntityTypeBuilder<PrescriptionItem> builder)
    {
        builder.ToTable("prescription_items");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.MedicationName)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.Dosage)
            .HasMaxLength(200);

        builder.Property(e => e.Frequency)
            .HasMaxLength(200);

        builder.Property(e => e.Duration)
            .HasMaxLength(200);

        builder.Property(e => e.Quantity)
            .HasPrecision(12, 3);

        builder.Property(e => e.Instructions)
            .HasMaxLength(500);

        builder.Property(e => e.SortOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasIndex(e => e.PrescriptionId);

        builder.HasOne(e => e.Prescription)
            .WithMany(e => e.Items)
            .HasForeignKey(e => e.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
