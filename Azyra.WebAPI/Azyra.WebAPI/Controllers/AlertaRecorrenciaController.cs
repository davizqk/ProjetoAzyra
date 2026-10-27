using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.AlertaRecorrencia;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertaRecorrenciaController : ControllerBase
{
    private readonly IAlertaRecorrenciaRepository _repository;
    public AlertaRecorrenciaController(IAlertaRecorrenciaRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AlertaRecorrenciaResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AlertaRecorrenciaResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlertaRecorrenciaResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<AlertaRecorrenciaResponseDTO>> Create([FromBody] AlertaRecorrenciaRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdAlerta;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] AlertaRecorrenciaRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdAlerta = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static AlertaRecorrencia ToEntity(AlertaRecorrenciaRequestDTO dto) => new()
    {
        IdAluno = dto.IdAluno,
        GeradoEm = dto.GeradoEm ?? DateTime.UtcNow,
        QuantidadeDetectada = dto.QuantidadeDetectada,
        Status = string.IsNullOrWhiteSpace(dto.Status) ? "Pendente" : dto.Status,
    };

    private static AlertaRecorrenciaResponseDTO ToResponse(AlertaRecorrencia entity) => new()
    {
        IdAlerta = entity.IdAlerta,
        IdAluno = entity.IdAluno,
        GeradoEm = entity.GeradoEm,
        QuantidadeDetectada = entity.QuantidadeDetectada,
        Status = entity.Status,
    };
}
