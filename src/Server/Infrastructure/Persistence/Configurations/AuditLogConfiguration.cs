using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.UserName)
            .HasMaxLength(255);

        builder.Property(e => e.Action)
            .IsRequired();

        builder.Property(e => e.EntityType)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.EntityDisplayName)
            .HasMaxLength(300);

        builder.Property(e => e.Changes)
            .HasMaxLength(5000);

        builder.Property(e => e.IpAddress)
            .HasMaxLength(45);

        builder.Property(e => e.UserAgent)
            .HasMaxLength(500);

        builder.Property(e => e.Timestamp)
            .IsRequired();

        builder.Property(e => e.AdditionalInfo)
            .HasMaxLength(1000);

        builder.HasIndex(e => e.UserId);

        builder.HasIndex(e => e.EntityType);

        builder.HasIndex(e => e.EntityId);

        builder.HasIndex(e => e.Action);

        builder.HasIndex(e => e.Timestamp);

        builder.HasIndex(e => new { e.EntityType, e.EntityId });

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
