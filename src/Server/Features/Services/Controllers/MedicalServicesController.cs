using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Services.Models;
using Server.Features.Services.Services;

namespace Server.Features.Services.Controllers;

[ApiController]
[Route("api/medical-services")]
[Authorize]
public class MedicalServicesController : ControllerBase
{
    private readonly IMedicalServiceService _service;
    public MedicalServicesController(IMedicalServiceService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] bool? isActive = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, search, categoryId, isActive);
        return Ok(ApiResponse<PagedResult<MedicalServiceListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("dropdown")]
    public async Task<IActionResult> GetForDropdown()
    {
        var result = await _service.GetForDropdownAsync();
        return Ok(ApiResponse<List<MedicalServiceDropdownResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<MedicalServiceResponse>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateMedicalServiceRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<MedicalServiceResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMedicalServiceRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<MedicalServiceResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
