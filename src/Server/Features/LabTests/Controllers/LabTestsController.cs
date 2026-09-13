using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.LabTests.Models;
using Server.Features.LabTests.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Controllers;

[ApiController]
[Route("api/lab-tests")]
[Authorize]
public class LabTestsController : ControllerBase
{
    private readonly ILabTestService _service;
    public LabTestsController(ILabTestService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] LabTestStatus? status = null,
        [FromQuery] string? category = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, doctorId, patientId, status, category);
        return Ok(ApiResponse<PagedResult<LabTestListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpGet("visit/{visitId:guid}")]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var result = await _service.GetByVisitIdAsync(visitId);
        return Ok(ApiResponse<List<LabTestResponse>>.SuccessResult(result));
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetByPatientId(
        Guid patientId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetByPatientIdAsync(patientId, page, pageSize);
        return Ok(ApiResponse<PagedResult<LabTestListItemResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Create([FromBody] CreateLabTestRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLabTestRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/start")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Start(Guid id)
    {
        var result = await _service.StartAsync(id);
        return Ok(ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Complete(Guid id, [FromBody] List<CreateLabResultRequest>? results = null)
    {
        var result = await _service.CompleteAsync(id, results ?? new List<CreateLabResultRequest>());
        return Ok(ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _service.CancelAsync(id);
        return Ok(ApiResponse<LabTestResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
