using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence.Configurations;

public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
{
    public void Configure(EntityTypeBuilder<Attachment> builder)
    {
        builder.ToTable("attachments");

        builder.UseXminAsConcurrencyToken();

        builder.HasKey(e => e.Id);

        builder.Property(e => e.FileName)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.OriginalFileName)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.FileExtension)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.MimeType)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.FileSize)
            .IsRequired();

        builder.Property(e => e.StoragePath)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.RelatedEntityType)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.RelatedEntityId)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.Property(e => e.Tags)
            .HasMaxLength(500);

        builder.HasIndex(e => new { e.RelatedEntityType, e.RelatedEntityId });

        builder.HasIndex(e => e.UploadedBy);

        builder.HasOne(e => e.Uploader)
            .WithMany()
            .HasForeignKey(e => e.UploadedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
