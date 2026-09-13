using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Visits.Models;
using Server.Features.Visits.Services;

namespace Server.Features.Visits.Controllers;

[ApiController]
[Route("api/visits/{visitId:guid}/diagnoses")]
[Authorize]
public class VisitDiagnosesController : ControllerBase
{
    private readonly IVisitDiagnosisService _service;
    public VisitDiagnosesController(IVisitDiagnosisService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var result = await _service.GetByVisitIdAsync(visitId);
        return Ok(ApiResponse<List<DiagnosisResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Create(Guid visitId, [FromBody] CreateDiagnosisRequest request)
    {
        var result = await _service.CreateAsync(visitId, request);
        return CreatedAtAction(nameof(GetByVisitId), new { visitId },
            ApiResponse<DiagnosisResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Update(Guid visitId, Guid id, [FromBody] UpdateDiagnosisRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<DiagnosisResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Delete(Guid visitId, Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
