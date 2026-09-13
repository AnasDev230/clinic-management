using Server.Core.Common;
using Server.Infrastructure.Identity;

namespace Server.Infrastructure.Persistence.Entities;

public class Attachment : BaseEntity
{
    public string FileName { get; set; } = string.Empty;

    public string OriginalFileName { get; set; } = string.Empty;

    public string FileExtension { get; set; } = string.Empty;

    public string MimeType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string StoragePath { get; set; } = string.Empty;

    public string RelatedEntityType { get; set; } = string.Empty;

    public Guid RelatedEntityId { get; set; }

    public Guid? UploadedBy { get; set; }

    public string? Description { get; set; }

    public string? Tags { get; set; }

    public ApplicationUser? Uploader { get; set; }
}
