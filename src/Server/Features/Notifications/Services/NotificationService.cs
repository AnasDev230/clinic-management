using Microsoft.AspNetCore.Identity;
using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Notifications.Models;
using Server.Features.Notifications.Repositories;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public NotificationService(
        INotificationRepository repository,
        UserManager<ApplicationUser> userManager,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _userManager = userManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<NotificationListItemResponse>> GetByUserIdAsync(
        Guid userId,
        int page,
        int pageSize,
        bool? isRead)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetByUserIdAsync(userId, page, pageSize, isRead);

        return new PagedResult<NotificationListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public Task<int> GetUnreadCountAsync(Guid userId)
        => _repository.GetUnreadCountAsync(userId);

    public async Task<List<NotificationListItemResponse>> GetLatestAsync(Guid userId, int count)
    {
        var items = await _repository.GetLatestAsync(userId, Math.Clamp(count, 1, 50));
        return items.Select(MapToListItem).ToList();
    }

    public async Task<NotificationResponse> MarkAsReadAsync(Guid notificationId)
    {
        var notification = await _repository.GetByIdForUpdateAsync(notificationId);
        if (notification is null || notification.UserId != _currentUserService.GetUserId())
            throw new NotFoundException("Notification", notificationId);

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(notificationId);
        return MapToResponse(updated!);
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        await _repository.MarkAllAsReadAsync(userId);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var notification = await _repository.GetByIdForUpdateAsync(id);
        if (notification is null || notification.UserId != _currentUserService.GetUserId())
            throw new NotFoundException("Notification", id);

        _repository.SoftDelete(notification);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Notification> CreateAsync(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        NotificationPriority priority,
        string? actionUrl,
        string? relatedEntityType,
        Guid? relatedEntityId)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title.Trim(),
            Message = message.Trim(),
            Type = type,
            Priority = priority,
            ActionUrl = actionUrl?.Trim(),
            RelatedEntityType = relatedEntityType?.Trim(),
            RelatedEntityId = relatedEntityId,
            IsRead = false,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(notification);
        await _dbContext.SaveChangesAsync();

        return notification;
    }

    public async Task CreateForRoleAsync(
        string role,
        string title,
        string message,
        NotificationType type,
        NotificationPriority priority,
        string? actionUrl)
    {
        var users = await _userManager.GetUsersInRoleAsync(role);

        foreach (var user in users)
        {
            await _repository.AddAsync(new Notification
            {
                UserId = user.Id,
                Title = title.Trim(),
                Message = message.Trim(),
                Type = type,
                Priority = priority,
                ActionUrl = actionUrl?.Trim(),
                IsRead = false,
                CreatedBy = _currentUserService.GetUserId()
            });
        }

        await _dbContext.SaveChangesAsync();
    }

    private static NotificationListItemResponse MapToListItem(Notification notification)
        => new()
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            Priority = notification.Priority,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

    private static NotificationResponse MapToResponse(Notification notification)
        => new()
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            Priority = notification.Priority,
            IsRead = notification.IsRead,
            ReadAt = notification.ReadAt,
            CreatedAt = notification.CreatedAt,
            ActionUrl = notification.ActionUrl,
            RelatedEntityType = notification.RelatedEntityType,
            RelatedEntityId = notification.RelatedEntityId
        };
}
