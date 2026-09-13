using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.AuditLogs.Models;
using Server.Features.AuditLogs.Services;

namespace Server.Features.AuditLogs.Controllers;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Roles = "SuperAdmin,Admin")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _service;
    public AuditLogsController(IAuditLogService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] AuditLogFilterRequest filter,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetAllAsync(
            page, pageSize, filter.UserId, filter.EntityType,
            filter.EntityId, filter.Action, filter.DateFrom, filter.DateTo);
        return Ok(ApiResponse<PagedResult<AuditLogListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<AuditLogResponse>.SuccessResult(result));
    }

    [HttpGet("entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetByEntity(string entityType, Guid entityId)
    {
        var result = await _service.GetByEntityAsync(entityType, entityId);
        return Ok(ApiResponse<List<AuditLogResponse>>.SuccessResult(result));
    }
}
