using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Attachments.Repositories;

public interface IAttachmentRepository
{
    Task<Attachment?> GetByIdAsync(Guid id);

    Task<Attachment?> GetByIdForUpdateAsync(Guid id);

    Task<List<Attachment>> GetByEntityAsync(string relatedEntityType, Guid relatedEntityId);

    Task<(List<Attachment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? relatedEntityType,
        Guid? relatedEntityId);

    Task AddAsync(Attachment attachment);

    void Update(Attachment attachment);

    void SoftDelete(Attachment attachment);
}
