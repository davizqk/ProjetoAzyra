using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.HistoricoAtraso;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoricoAtrasoController : ControllerBase
{
    private readonly IHistoricoAtrasoRepository _repository;
    public HistoricoAtrasoController(IHistoricoAtrasoRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<HistoricoAtrasoResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<HistoricoAtrasoResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> Create([FromBody] HistoricoAtrasoRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdHistorico;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] HistoricoAtrasoRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdHistorico = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static HistoricoAtraso ToEntity(HistoricoAtrasoRequestDTO dto) => new()
    {
        IdAluno = dto.IdAluno,
        Data = DateOnly.FromDateTime(dto.Data),
        Atrasado = dto.Atrasado,
        ConsecutivoAtual = dto.ConsecutivoAtual,
    };

    private static HistoricoAtrasoResponseDTO ToResponse(HistoricoAtraso entity) => new()
    {
        IdHistorico = entity.IdHistorico,
        IdAluno = entity.IdAluno,
        Data = entity.Data.ToDateTime(TimeOnly.MinValue),
        Atrasado = entity.Atrasado,
        ConsecutivoAtual = entity.ConsecutivoAtual,
    };
}
