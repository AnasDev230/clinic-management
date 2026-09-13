using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Appointments.Models;
using Server.Features.Appointments.Services;

namespace Server.Features.Appointments.Controllers;

[ApiController]
[Route("api/appointments/{appointmentId:guid}/follow-ups")]
[Authorize]
public class FollowUpsController : ControllerBase
{
    private readonly IFollowUpService _service;
    public FollowUpsController(IFollowUpService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByAppointmentId(Guid appointmentId)
    {
        var result = await _service.GetByAppointmentIdAsync(appointmentId);
        return Ok(ApiResponse<List<FollowUpResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist,Doctor")]
    public async Task<IActionResult> Create(Guid appointmentId, [FromBody] CreateFollowUpRequest request)
    {
        var result = await _service.CreateAsync(appointmentId, request);
        return CreatedAtAction(nameof(GetByAppointmentId), new { appointmentId },
            ApiResponse<FollowUpResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist,Doctor")]
    public async Task<IActionResult> Update(Guid appointmentId, Guid id, [FromBody] UpdateFollowUpRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<FollowUpResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist,Doctor")]
    public async Task<IActionResult> Complete(Guid appointmentId, Guid id)
    {
        var result = await _service.CompleteAsync(id);
        return Ok(ApiResponse<FollowUpResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist,Doctor")]
    public async Task<IActionResult> Delete(Guid appointmentId, Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
