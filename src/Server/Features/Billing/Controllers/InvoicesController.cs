using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Billing.Models;
using Server.Features.Billing.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Controllers;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _service;
    public InvoicesController(IInvoiceService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] InvoiceStatus? status = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, patientId, doctorId, status, dateFrom, dateTo);
        return Ok(ApiResponse<PagedResult<InvoiceListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _service.GetSummaryAsync();
        return Ok(ApiResponse<InvoiceSummaryResponse>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpGet("number/{invoiceNumber}")]
    public async Task<IActionResult> GetByInvoiceNumber(string invoiceNumber)
    {
        var result = await _service.GetByInvoiceNumberAsync(invoiceNumber);
        return Ok(ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetByPatientId(Guid patientId)
    {
        var result = await _service.GetByPatientIdAsync(patientId);
        return Ok(ApiResponse<List<InvoiceListItemResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvoiceRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/issue")]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Issue(Guid id)
    {
        var result = await _service.IssueAsync(id);
        return Ok(ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _service.CancelAsync(id);
        return Ok(ApiResponse<InvoiceResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
