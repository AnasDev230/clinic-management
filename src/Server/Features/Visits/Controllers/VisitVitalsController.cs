using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Visits.Models;
using Server.Features.Visits.Services;

namespace Server.Features.Visits.Controllers;

[ApiController]
[Route("api/visits/{visitId:guid}/vitals")]
[Authorize]
public class VisitVitalsController : ControllerBase
{
    private readonly IVisitVitalsService _service;
    public VisitVitalsController(IVisitVitalsService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByVisitId(Guid visitId)
    {
        var result = await _service.GetByVisitIdAsync(visitId);
        return Ok(ApiResponse<VitalsResponse?>.SuccessResult(result));
    }

    [HttpPut]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> CreateOrUpdate(Guid visitId, [FromBody] CreateVitalsRequest request)
    {
        var result = await _service.CreateOrUpdateAsync(visitId, request);
        return Ok(ApiResponse<VitalsResponse>.SuccessResult(result));
    }
}
