using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class MedicalServiceConfiguration : IEntityTypeConfiguration<MedicalService>
{
    public void Configure(EntityTypeBuilder<MedicalService> builder)
    {
        builder.ToTable("medical_services");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.Property(e => e.Price)
            .HasPrecision(15, 2)
            .IsRequired();

        builder.Property(e => e.DurationMinutes)
            .IsRequired()
            .HasDefaultValue(30);

        builder.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(e => e.RequiresAppointment)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(e => e.SortOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasIndex(e => e.CategoryId);

        builder.HasIndex(e => e.IsActive);

        builder.HasIndex(e => e.SortOrder);

        builder.HasIndex(e => e.Name)
            .IsUnique();

        builder.HasOne(e => e.Category)
            .WithMany(e => e.MedicalServices)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
