namespace Server.Features.Attachments.Models;

public class AttachmentListItemResponse
{
    public Guid Id { get; set; }

    public string OriginalFileName { get; set; } = string.Empty;

    public string FileExtension { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string UploadedByName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
