using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Clinic.Models;
using Server.Features.Clinic.Services;

namespace Server.Features.Clinic.Controllers;

[ApiController]
[Route("api/clinic")]
[Authorize]
public class ClinicController : ControllerBase
{
    private readonly IClinicService _service;
    public ClinicController(IClinicService service) => _service = service;

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _service.GetProfileAsync();
        return Ok(ApiResponse<ClinicProfileResponse>.SuccessResult(result));
    }

    [HttpPut("profile")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateClinicProfileRequest request)
    {
        var result = await _service.UpdateProfileAsync(request);
        return Ok(ApiResponse<ClinicProfileResponse>.SuccessResult(result));
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var result = await _service.GetSettingsAsync();
        return Ok(ApiResponse<ClinicSettingsResponse>.SuccessResult(result));
    }

    [HttpPut("settings")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateClinicSettingsRequest request)
    {
        var result = await _service.UpdateSettingsAsync(request);
        return Ok(ApiResponse<ClinicSettingsResponse>.SuccessResult(result));
    }
}
