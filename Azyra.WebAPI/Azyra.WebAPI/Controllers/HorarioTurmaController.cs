using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.HorarioTurma;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HorarioTurmaController : ControllerBase
{
    private readonly IHorarioTurmaRepository _repository;
    public HorarioTurmaController(IHorarioTurmaRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<HorarioTurmaResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<HorarioTurmaResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HorarioTurmaResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<HorarioTurmaResponseDTO>> Create([FromBody] HorarioTurmaRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdHorario;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] HorarioTurmaRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdHorario = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static HorarioTurma ToEntity(HorarioTurmaRequestDTO dto) => new()
    {
        DiaSemana = dto.DiaSemana,
        HoraEntrada = TimeOnly.FromTimeSpan(dto.HoraEntrada),
        ToleranciaMin = dto.ToleranciaMin,
        IdTurma = dto.IdTurma,
    };

    private static HorarioTurmaResponseDTO ToResponse(HorarioTurma entity) => new()
    {
        IdHorario = entity.IdHorario,
        DiaSemana = entity.DiaSemana,
        HoraEntrada = entity.HoraEntrada.ToTimeSpan(),
        ToleranciaMin = entity.ToleranciaMin,
        IdTurma = entity.IdTurma,
    };
}
