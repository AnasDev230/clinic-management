using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Patients.Models;
using Server.Features.Patients.Services;

namespace Server.Features.Patients.Controllers;

[ApiController]
[Route("api/patients/{patientId:guid}/insurance")]
[Authorize]
public class PatientInsuranceController : ControllerBase
{
    private readonly IPatientInsuranceService _service;
    public PatientInsuranceController(IPatientInsuranceService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByPatientId(Guid patientId)
    {
        var result = await _service.GetByPatientIdAsync(patientId);
        return Ok(ApiResponse<InsuranceResponse?>.SuccessResult(result));
    }

    [HttpPut]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> CreateOrUpdate(Guid patientId, [FromBody] CreateInsuranceRequest request)
    {
        var result = await _service.CreateOrUpdateAsync(patientId, request);
        return Ok(ApiResponse<InsuranceResponse>.SuccessResult(result));
    }

    [HttpDelete]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Delete(Guid patientId)
    {
        await _service.DeleteAsync(patientId);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
