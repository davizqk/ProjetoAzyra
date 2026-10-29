using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.ModeloEnsino;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModeloEnsinoController : ControllerBase
{
    private readonly IModeloEnsinoRepository _repository;
    public ModeloEnsinoController(IModeloEnsinoRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ModeloEnsinoResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ModeloEnsinoResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ModeloEnsinoResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<ModeloEnsinoResponseDTO>> Create([FromBody] ModeloEnsinoRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdModelo;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ModeloEnsinoRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdModelo = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static ModeloEnsino ToEntity(ModeloEnsinoRequestDTO dto) => new()
    {
        Nome = dto.Nome,
        Descricao = dto.Descricao,
    };

    private static ModeloEnsinoResponseDTO ToResponse(ModeloEnsino entity) => new()
    {
        IdModelo = entity.IdModelo,
        Nome = entity.Nome,
        Descricao = entity.Descricao,
    };
}
