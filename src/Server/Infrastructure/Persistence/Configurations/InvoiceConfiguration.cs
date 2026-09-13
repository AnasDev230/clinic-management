using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("invoices");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.InvoiceNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.InvoiceDate)
            .IsRequired();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.InvoiceStatus.Draft);

        builder.Property(e => e.SubTotal)
            .HasPrecision(15, 2);

        builder.Property(e => e.DiscountAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.DiscountPercentage)
            .HasPrecision(5, 2);

        builder.Property(e => e.TaxAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.TaxPercentage)
            .HasPrecision(5, 2);

        builder.Property(e => e.TotalAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.PaidAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.RemainingAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.Notes)
            .HasMaxLength(2000);

        builder.Property(e => e.IssuedBy)
            .IsRequired();

        builder.HasIndex(e => e.InvoiceNumber)
            .IsUnique();

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.VisitId);

        builder.HasIndex(e => e.DoctorId);

        builder.HasIndex(e => e.InvoiceDate);

        builder.HasIndex(e => e.Status);

        builder.HasIndex(e => e.DueDate);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Visit)
            .WithMany()
            .HasForeignKey(e => e.VisitId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Doctor)
            .WithMany()
            .HasForeignKey(e => e.DoctorId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
