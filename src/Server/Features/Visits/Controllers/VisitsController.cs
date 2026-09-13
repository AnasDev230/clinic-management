using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Visits.Models;
using Server.Features.Visits.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Controllers;

[ApiController]
[Route("api/visits")]
[Authorize]
public class VisitsController : ControllerBase
{
    private readonly IVisitService _service;
    public VisitsController(IVisitService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] VisitStatus? status = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, doctorId, patientId, status, dateFrom, dateTo);
        return Ok(ApiResponse<PagedResult<VisitListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var result = await _service.GetTodayAsync();
        return Ok(ApiResponse<List<VisitListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<VisitResponse>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Create([FromBody] CreateVisitRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<VisitResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVisitRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<VisitResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/start-consultation")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> StartConsultation(Guid id)
    {
        var result = await _service.StartConsultationAsync(id);
        return Ok(ApiResponse<VisitResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var result = await _service.CompleteAsync(id);
        return Ok(ApiResponse<VisitResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
