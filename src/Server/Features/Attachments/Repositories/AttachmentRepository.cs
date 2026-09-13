using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Attachments.Repositories;

public class AttachmentRepository : IAttachmentRepository
{
    private readonly AppDbContext _dbContext;

    public AttachmentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Attachment?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);

    public Task<Attachment?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(a => a.Id == id);

    public Task<List<Attachment>> GetByEntityAsync(string relatedEntityType, Guid relatedEntityId)
        => WithDetails()
            .AsNoTracking()
            .Where(a => a.RelatedEntityType == relatedEntityType && a.RelatedEntityId == relatedEntityId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task<(List<Attachment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? relatedEntityType,
        Guid? relatedEntityId)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(a =>
                a.OriginalFileName.ToLower().Contains(term) ||
                (a.Description != null && a.Description.ToLower().Contains(term)) ||
                (a.Tags != null && a.Tags.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(relatedEntityType))
            query = query.Where(a => a.RelatedEntityType == relatedEntityType);

        if (relatedEntityId.HasValue)
            query = query.Where(a => a.RelatedEntityId == relatedEntityId.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(Attachment attachment)
    {
        await _dbContext.Attachments.AddAsync(attachment);
    }

    public void Update(Attachment attachment)
        => _dbContext.Attachments.Update(attachment);

    public void SoftDelete(Attachment attachment)
        => _dbContext.Attachments.Remove(attachment);

    private IQueryable<Attachment> WithDetails()
        => _dbContext.Attachments
            .Include(a => a.Uploader);
}
