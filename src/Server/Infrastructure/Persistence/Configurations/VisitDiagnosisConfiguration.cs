using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class VisitDiagnosisConfiguration : IEntityTypeConfiguration<VisitDiagnosis>
{
    public void Configure(EntityTypeBuilder<VisitDiagnosis> builder)
    {
        builder.ToTable("visit_diagnoses");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Code)
            .HasMaxLength(20);

        builder.Property(e => e.Name)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.Property(e => e.IsPrimary)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasIndex(e => e.VisitId);

        builder.HasOne(e => e.Visit)
            .WithMany(e => e.Diagnoses)
            .HasForeignKey(e => e.VisitId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
