using Microsoft.AspNetCore.Http;

namespace Server.Features.Attachments.Models;

public class UploadAttachmentRequest
{
    public IFormFile File { get; set; } = null!;

    public string RelatedEntityType { get; set; } = string.Empty;

    public Guid RelatedEntityId { get; set; }

    public string? Description { get; set; }

    public string? Tags { get; set; }
}
