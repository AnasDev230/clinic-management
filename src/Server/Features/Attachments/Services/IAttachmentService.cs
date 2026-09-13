using Server.Core.Common;
using Server.Features.Attachments.Models;

namespace Server.Features.Attachments.Services;

public interface IAttachmentService
{
    Task<AttachmentResponse> UploadAsync(UploadAttachmentRequest request);

    Task<AttachmentResponse> UpdateAsync(Guid id, UpdateAttachmentRequest request);

    Task<AttachmentResponse> GetByIdAsync(Guid id);

    Task<List<AttachmentListItemResponse>> GetByEntityAsync(string relatedEntityType, Guid relatedEntityId);

    Task<PagedResult<AttachmentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? relatedEntityType,
        Guid? relatedEntityId);

    Task<(Stream FileStream, string ContentType, string FileName)> GetFileAsync(Guid id);

    Task DeleteAsync(Guid id);
}
