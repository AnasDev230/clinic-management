using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Core.Interfaces;
using Server.Features.Notifications.Models;
using Server.Features.Notifications.Services;

namespace Server.Features.Notifications.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;
    private readonly ICurrentUserService _currentUserService;

    public NotificationsController(
        INotificationService service,
        ICurrentUserService currentUserService)
    {
        _service = service;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? isRead = null)
    {
        var result = await _service.GetByUserIdAsync(GetCurrentUserId(), page, pageSize, isRead);
        return Ok(ApiResponse<PagedResult<NotificationListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await _service.GetUnreadCountAsync(GetCurrentUserId());
        return Ok(ApiResponse<UnreadCountResponse>.SuccessResult(new UnreadCountResponse { Count = count }));
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest([FromQuery] int count = 5)
    {
        var result = await _service.GetLatestAsync(GetCurrentUserId(), count);
        return Ok(ApiResponse<List<NotificationListItemResponse>>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var result = await _service.MarkAsReadAsync(id);
        return Ok(ApiResponse<NotificationResponse>.SuccessResult(result));
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        await _service.MarkAllAsReadAsync(GetCurrentUserId());
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }

    private Guid GetCurrentUserId()
        => _currentUserService.GetUserId()
            ?? throw new UnauthorizedAccessException("User is not authenticated.");
}
