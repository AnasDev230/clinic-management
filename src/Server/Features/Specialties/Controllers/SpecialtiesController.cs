using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Specialties.Models;
using Server.Features.Specialties.Services;

namespace Server.Features.Specialties.Controllers;

[ApiController]
[Route("api/specialties")]
[Authorize]
public class SpecialtiesController : ControllerBase
{
    private readonly ISpecialtyService _service;
    public SpecialtiesController(ISpecialtyService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetAllAsync(search, isActive, page, pageSize);
        return Ok(ApiResponse<PagedResult<SpecialtyListItemResponse>>.SuccessResult(result));
    }

    [HttpGet("dropdown")]
    public async Task<IActionResult> GetDropdown()
    {
        var result = await _service.GetDropdownAsync();
        return Ok(ApiResponse<List<SpecialtyDropdownResponse>>.SuccessResult(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(ApiResponse<SpecialtyResponse>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateSpecialtyRequest request)
    {
        var result = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<SpecialtyResponse>.SuccessResult(result));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSpecialtyRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        return Ok(ApiResponse<SpecialtyResponse>.SuccessResult(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResult(null!));
    }
}
