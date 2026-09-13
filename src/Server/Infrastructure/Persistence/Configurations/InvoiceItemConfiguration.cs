using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class InvoiceItemConfiguration : IEntityTypeConfiguration<InvoiceItem>
{
    public void Configure(EntityTypeBuilder<InvoiceItem> builder)
    {
        builder.ToTable("invoice_items");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.ServiceName)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.Property(e => e.Quantity)
            .HasPrecision(12, 3)
            .IsRequired()
            .HasDefaultValue(1m);

        builder.Property(e => e.UnitPrice)
            .HasPrecision(15, 2)
            .IsRequired();

        builder.Property(e => e.DiscountAmount)
            .HasPrecision(15, 2);

        builder.Property(e => e.TotalAmount)
            .HasPrecision(15, 2)
            .IsRequired();

        builder.Property(e => e.SortOrder)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasIndex(e => e.InvoiceId);

        builder.HasIndex(e => e.MedicalServiceId);

        builder.HasOne(e => e.Invoice)
            .WithMany(e => e.Items)
            .HasForeignKey(e => e.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.MedicalService)
            .WithMany()
            .HasForeignKey(e => e.MedicalServiceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
