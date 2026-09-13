namespace Server.Features.Attachments.Models;

public class AttachmentResponse
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string OriginalFileName { get; set; } = string.Empty;

    public string FileExtension { get; set; } = string.Empty;

    public string MimeType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string? Description { get; set; }

    public string? Tags { get; set; }

    public string UploadedByName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string DownloadUrl { get; set; } = string.Empty;
}
