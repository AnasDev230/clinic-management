using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Patients.Models;
using Server.Features.Patients.Services;

namespace Server.Features.Patients.Controllers;

[ApiController]
[Route("api/patients/{patientId:guid}/allergies")]
[Authorize]
public class PatientAllergiesController : ControllerBase
{
    private readonly IPatientAllergyService _service;
    public PatientAllergiesController(IPatientAllergyService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByPatientId(Guid patientId)
    {
        var result = await _service.GetByPatientIdAsync(patientId);
        return Ok(ApiResponse<List<AllergyResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Create(Guid patientId, [FromBody] CreateAllergyRequest request)
    {
        var result = await _service.CreateAsync(patientId, request);
        return CreatedAtAction(nameof(GetByPatientId), new { patientId },
            ApiResponse<AllergyResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid patientId, Guid id, [FromBody] UpdateAllergyRequest request)
    {
        var result = await _service.UpdateAsync(id, request, patientId);
        return Ok(ApiResponse<AllergyResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Delete(Guid patientId, Guid id)
    {
        await _service.DeleteAsync(id, patientId);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
