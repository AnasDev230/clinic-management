using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.PaymentNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasPrecision(15, 2)
            .IsRequired();

        builder.Property(e => e.PaymentMethod)
            .IsRequired();

        builder.Property(e => e.PaymentDate)
            .IsRequired();

        builder.Property(e => e.ReferenceNumber)
            .HasMaxLength(100);

        builder.Property(e => e.Notes)
            .HasMaxLength(500);

        builder.Property(e => e.ReceivedBy)
            .IsRequired();

        builder.Property(e => e.Status)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.PaymentStatus.Completed);

        builder.HasIndex(e => e.PaymentNumber)
            .IsUnique();

        builder.HasIndex(e => e.InvoiceId);

        builder.HasIndex(e => e.PatientId);

        builder.HasIndex(e => e.PaymentDate);

        builder.HasIndex(e => e.PaymentMethod);

        builder.HasIndex(e => e.Status);

        builder.HasOne(e => e.Invoice)
            .WithMany(e => e.Payments)
            .HasForeignKey(e => e.InvoiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
