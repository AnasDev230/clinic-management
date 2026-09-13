using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Attachments.Models;
using Server.Features.Attachments.Services;

namespace Server.Features.Attachments.Controllers;

[ApiController]
[Route("api/attachments")]
[Authorize]
public class AttachmentsController : ControllerBase
{
    private readonly IAttachmentService _service;
    public AttachmentsController(IAttachmentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? relatedEntityType = null,
        [FromQuery] Guid? relatedEntityId = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, relatedEntityType, relatedEntityId);
        return Ok(ApiResponse<PagedResult<AttachmentListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<AttachmentResponse>.SuccessResult(result));
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> Download(Guid id)
    {
        var (fileStream, contentType, fileName) = await _service.GetFileAsync(id);
        return File(fileStream, contentType, fileName);
    }

    [HttpGet("entity/{entityType}/{entityId:guid}")]
    public async Task<IActionResult> GetByEntity(string entityType, Guid entityId)
    {
        var result = await _service.GetByEntityAsync(entityType, entityId);
        return Ok(ApiResponse<List<AttachmentListItemResponse>>.SuccessResult(result));
    }

    [HttpPost("upload")]
    [RequestSizeLimit(11 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromForm] UploadAttachmentRequest request)
    {
        var result = await _service.UploadAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<AttachmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAttachmentRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<AttachmentResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
