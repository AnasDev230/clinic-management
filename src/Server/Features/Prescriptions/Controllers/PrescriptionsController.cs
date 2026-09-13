using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Prescriptions.Models;
using Server.Features.Prescriptions.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Controllers;

[ApiController]
[Route("api/prescriptions")]
[Authorize]
public class PrescriptionsController : ControllerBase
{
    private readonly IPrescriptionService _service;
    public PrescriptionsController(IPrescriptionService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] PrescriptionStatus? status = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, doctorId, patientId, status);
        return Ok(ApiResponse<PagedResult<PrescriptionListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<PrescriptionResponse>.SuccessResult(result));
    }

    [HttpGet("visit/{visitId:guid}")]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var result = await _service.GetByVisitIdAsync(visitId);
        return Ok(ApiResponse<List<PrescriptionResponse>>.SuccessResult(result));
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetByPatientId(
        Guid patientId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetByPatientIdAsync(patientId, page, pageSize);
        return Ok(ApiResponse<PagedResult<PrescriptionListItemResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Create([FromBody] CreatePrescriptionRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<PrescriptionResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePrescriptionRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<PrescriptionResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var result = await _service.CompleteAsync(id);
        return Ok(ApiResponse<PrescriptionResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _service.CancelAsync(id);
        return Ok(ApiResponse<PrescriptionResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
