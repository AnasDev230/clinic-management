using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Appointments.Models;
using Server.Features.Appointments.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;
    public AppointmentsController(IAppointmentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] AppointmentStatus? status = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, doctorId, patientId, status, dateFrom, dateTo);
        return Ok(ApiResponse<PagedResult<AppointmentListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var result = await _service.GetTodayAsync();
        return Ok(ApiResponse<List<AppointmentCalendarResponse>>.SuccessResult(result));
    }

    [HttpGet("doctor/{doctorId:guid}/date/{date:datetime}")]
    public async Task<IActionResult> GetByDoctorAndDate(Guid doctorId, DateTime date)
    {
        var result = await _service.GetByDoctorAndDateAsync(doctorId, date);
        return Ok(ApiResponse<List<AppointmentCalendarResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAppointmentRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/confirm")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var result = await _service.ConfirmAsync(id);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/start")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Start(Guid id)
    {
        var result = await _service.StartAsync(id);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/complete")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var result = await _service.CompleteAsync(id);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelAppointmentRequest request)
    {
        var result = await _service.CancelAsync(id, request);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/no-show")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> MarkNoShow(Guid id)
    {
        var result = await _service.MarkNoShowAsync(id);
        return Ok(ApiResponse<AppointmentResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
