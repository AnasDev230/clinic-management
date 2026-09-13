using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.UserId)
            .IsRequired();

        builder.Property(e => e.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Message)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.Type)
            .IsRequired();

        builder.Property(e => e.Priority)
            .IsRequired()
            .HasDefaultValue(Entities.Enums.NotificationPriority.Normal);

        builder.Property(e => e.RelatedEntityType)
            .HasMaxLength(100);

        builder.Property(e => e.IsRead)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(e => e.ActionUrl)
            .HasMaxLength(500);

        builder.HasIndex(e => e.UserId);

        builder.HasIndex(e => e.IsRead);

        builder.HasIndex(e => e.Type);

        builder.HasIndex(e => e.CreatedAt);

        builder.HasIndex(e => new { e.UserId, e.IsRead });

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
