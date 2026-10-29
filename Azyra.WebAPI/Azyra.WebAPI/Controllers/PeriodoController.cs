using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.Periodo;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeriodoController : ControllerBase
{
    private readonly IPeriodoRepository _repository;
    public PeriodoController(IPeriodoRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PeriodoResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PeriodoResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PeriodoResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<PeriodoResponseDTO>> Create([FromBody] PeriodoRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdPeriodo;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PeriodoRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdPeriodo = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static Periodo ToEntity(PeriodoRequestDTO dto) => new()
    {
        Nome = dto.Nome,
        HoraInicio = TimeOnly.FromTimeSpan(dto.HoraInicio),
        HoraFim = TimeOnly.FromTimeSpan(dto.HoraFim),
    };

    private static PeriodoResponseDTO ToResponse(Periodo entity) => new()
    {
        IdPeriodo = entity.IdPeriodo,
        Nome = entity.Nome,
        HoraInicio = entity.HoraInicio.ToTimeSpan(),
        HoraFim = entity.HoraFim.ToTimeSpan(),
    };
}
