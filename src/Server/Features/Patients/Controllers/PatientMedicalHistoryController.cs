using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Patients.Models;
using Server.Features.Patients.Services;

namespace Server.Features.Patients.Controllers;

[ApiController]
[Route("api/patients/{patientId:guid}/medical-history")]
[Authorize]
public class PatientMedicalHistoryController : ControllerBase
{
    private readonly IPatientMedicalHistoryService _service;
    public PatientMedicalHistoryController(IPatientMedicalHistoryService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByPatientId(Guid patientId)
    {
        var result = await _service.GetByPatientIdAsync(patientId);
        return Ok(ApiResponse<List<MedicalHistoryResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Create(Guid patientId, [FromBody] CreateMedicalHistoryRequest request)
    {
        var result = await _service.CreateAsync(patientId, request);
        return CreatedAtAction(nameof(GetByPatientId), new { patientId },
            ApiResponse<MedicalHistoryResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid patientId, Guid id, [FromBody] UpdateMedicalHistoryRequest request)
    {
        var result = await _service.UpdateAsync(id, request, patientId);
        return Ok(ApiResponse<MedicalHistoryResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Delete(Guid patientId, Guid id)
    {
        await _service.DeleteAsync(id, patientId);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
