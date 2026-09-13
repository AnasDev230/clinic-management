using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Billing.Models;
using Server.Features.Billing.Services;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _service;
    public PaymentsController(IPaymentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] PaymentMethod? method = null,
        [FromQuery] PaymentStatus? status = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, patientId, method, status, dateFrom, dateTo);
        return Ok(ApiResponse<PagedResult<PaymentListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<PaymentResponse>.SuccessResult(result));
    }

    [HttpGet("invoice/{invoiceId:guid}")]
    public async Task<IActionResult> GetByInvoiceId(Guid invoiceId)
    {
        var result = await _service.GetByInvoiceIdAsync(invoiceId);
        return Ok(ApiResponse<List<PaymentResponse>>.SuccessResult(result));
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<IActionResult> GetByPatientId(Guid patientId)
    {
        var result = await _service.GetByPatientIdAsync(patientId);
        return Ok(ApiResponse<List<PaymentListItemResponse>>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Receptionist")]
    public async Task<IActionResult> Create([FromBody] CreatePaymentRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<PaymentResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}/refund")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Refund(Guid id)
    {
        var result = await _service.RefundAsync(id);
        return Ok(ApiResponse<PaymentResponse>.SuccessResult(result));
    }
}
