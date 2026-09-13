using Microsoft.AspNetCore.Hosting;
using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Attachments.Models;
using Server.Features.Attachments.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Attachments.Services;

public class AttachmentService : IAttachmentService
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".dicom",
        ".doc", ".docx", ".xls", ".xlsx"
    };

    private readonly IAttachmentRepository _repository;
    private readonly IWebHostEnvironment _environment;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public AttachmentService(
        IAttachmentRepository repository,
        IWebHostEnvironment environment,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _environment = environment;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<AttachmentResponse> UploadAsync(UploadAttachmentRequest request)
    {
        if (request.File is null || request.File.Length == 0)
            throw new BusinessException("No file was uploaded.");

        if (request.File.Length > MaxFileSizeBytes)
            throw new BusinessException("File size must not exceed 10 MB.");

        var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            throw new BusinessException("File type is not allowed. Allowed types: pdf, jpg, jpeg, png, gif, dicom, doc, docx, xls, xlsx.");

        if (string.IsNullOrWhiteSpace(request.RelatedEntityType))
            throw new BusinessException("Related entity type is required.");

        var now = DateTime.UtcNow;
        var safeEntityType = SanitizePathSegment(request.RelatedEntityType.Trim());
        var fileName = $"{Guid.NewGuid()}{extension}";
        var relativePath = Path.Combine("uploads", safeEntityType, now.ToString("yyyy"), now.ToString("MM"), fileName);

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");

        var fullPath = Path.Combine(webRoot, relativePath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        await using (var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await request.File.CopyToAsync(fileStream);
        }

        var attachment = new Attachment
        {
            FileName = fileName,
            OriginalFileName = request.File.FileName,
            FileExtension = extension,
            MimeType = string.IsNullOrWhiteSpace(request.File.ContentType)
                ? "application/octet-stream"
                : request.File.ContentType,
            FileSize = request.File.Length,
            StoragePath = relativePath.Replace(Path.DirectorySeparatorChar, '/'),
            RelatedEntityType = request.RelatedEntityType.Trim(),
            RelatedEntityId = request.RelatedEntityId,
            UploadedBy = _currentUserService.GetUserId(),
            Description = request.Description?.Trim(),
            Tags = request.Tags?.Trim(),
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(attachment);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(attachment.Id);
        return MapToResponse(created!);
    }

    public async Task<AttachmentResponse> UpdateAsync(Guid id, UpdateAttachmentRequest request)
    {
        var attachment = await _repository.GetByIdForUpdateAsync(id);
        if (attachment is null)
            throw new NotFoundException("Attachment", id);

        attachment.Description = request.Description?.Trim();
        attachment.Tags = request.Tags?.Trim();
        attachment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AttachmentResponse> GetByIdAsync(Guid id)
    {
        var attachment = await _repository.GetByIdAsync(id);
        if (attachment is null)
            throw new NotFoundException("Attachment", id);

        return MapToResponse(attachment);
    }

    public async Task<List<AttachmentListItemResponse>> GetByEntityAsync(string relatedEntityType, Guid relatedEntityId)
    {
        var items = await _repository.GetByEntityAsync(relatedEntityType, relatedEntityId);
        return items.Select(MapToListItem).ToList();
    }

    public async Task<PagedResult<AttachmentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        string? relatedEntityType,
        Guid? relatedEntityId)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, relatedEntityType, relatedEntityId);

        return new PagedResult<AttachmentListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<(Stream FileStream, string ContentType, string FileName)> GetFileAsync(Guid id)
    {
        var attachment = await _repository.GetByIdAsync(id);
        if (attachment is null)
            throw new NotFoundException("Attachment", id);

        var fullPath = ResolveFullPath(attachment.StoragePath);
        if (!File.Exists(fullPath))
            throw new NotFoundException($"File for attachment '{id}' was not found on disk.");

        var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return (stream, attachment.MimeType, attachment.OriginalFileName);
    }

    public async Task DeleteAsync(Guid id)
    {
        var attachment = await _repository.GetByIdForUpdateAsync(id);
        if (attachment is null)
            throw new NotFoundException("Attachment", id);

        _repository.SoftDelete(attachment);
        await _dbContext.SaveChangesAsync();

        var fullPath = ResolveFullPath(attachment.StoragePath);
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }

    private string ResolveFullPath(string storagePath)
    {
        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");

        var relativePath = storagePath.Replace('/', Path.DirectorySeparatorChar);
        return Path.Combine(webRoot, relativePath);
    }

    private static string SanitizePathSegment(string segment)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var cleaned = new string(segment.Where(c => !invalid.Contains(c)).ToArray());
        return string.IsNullOrWhiteSpace(cleaned) ? "misc" : cleaned;
    }

    private static string BuildUploaderName(Attachment attachment)
        => attachment.Uploader?.FullName
            ?? attachment.Uploader?.UserName
            ?? string.Empty;

    private static AttachmentListItemResponse MapToListItem(Attachment attachment)
        => new()
        {
            Id = attachment.Id,
            OriginalFileName = attachment.OriginalFileName,
            FileExtension = attachment.FileExtension,
            FileSize = attachment.FileSize,
            UploadedByName = BuildUploaderName(attachment),
            CreatedAt = attachment.CreatedAt
        };

    private static AttachmentResponse MapToResponse(Attachment attachment)
        => new()
        {
            Id = attachment.Id,
            FileName = attachment.FileName,
            OriginalFileName = attachment.OriginalFileName,
            FileExtension = attachment.FileExtension,
            MimeType = attachment.MimeType,
            FileSize = attachment.FileSize,
            Description = attachment.Description,
            Tags = attachment.Tags,
            UploadedByName = BuildUploaderName(attachment),
            CreatedAt = attachment.CreatedAt,
            DownloadUrl = $"/api/attachments/{attachment.Id}/download"
        };
}
