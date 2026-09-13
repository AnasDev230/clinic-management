using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class VisitVitalsConfiguration : IEntityTypeConfiguration<VisitVitals>
{
    public void Configure(EntityTypeBuilder<VisitVitals> builder)
    {
        builder.ToTable("visit_vitals");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Temperature)
            .HasPrecision(4, 1);

        builder.Property(e => e.OxygenSaturation)
            .HasPrecision(4, 1);

        builder.Property(e => e.Weight)
            .HasPrecision(5, 1);

        builder.Property(e => e.Height)
            .HasPrecision(5, 1);

        builder.Property(e => e.BMI)
            .HasPrecision(4, 1);

        builder.Property(e => e.Notes)
            .HasMaxLength(500);

        builder.HasIndex(e => e.VisitId)
            .IsUnique();

        builder.HasOne(e => e.Visit)
            .WithOne(e => e.Vitals)
            .HasForeignKey<VisitVitals>(e => e.VisitId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
