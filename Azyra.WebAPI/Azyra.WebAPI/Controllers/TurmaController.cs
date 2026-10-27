using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.Turma;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TurmaController : ControllerBase
{
    private readonly ITurmaRepository _repository;
    public TurmaController(ITurmaRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TurmaResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TurmaResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TurmaResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<TurmaResponseDTO>> Create([FromBody] TurmaRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdTurma;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TurmaRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdTurma = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static Turma ToEntity(TurmaRequestDTO dto) => new()
    {
        Nome = dto.Nome,
        AnoLetivo = dto.AnoLetivo,
        IdModelo = dto.IdModelo,
        IdPeriodo = dto.IdPeriodo,
    };

    private static TurmaResponseDTO ToResponse(Turma entity) => new()
    {
        IdTurma = entity.IdTurma,
        Nome = entity.Nome,
        AnoLetivo = entity.AnoLetivo,
        IdModelo = entity.IdModelo,
        IdPeriodo = entity.IdPeriodo,
    };
}
