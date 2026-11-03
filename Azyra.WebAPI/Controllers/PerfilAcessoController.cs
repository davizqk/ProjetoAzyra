using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.PerfilAcesso;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PerfilAcessoController : ControllerBase
{
    private readonly IPerfilAcessoRepository _repository;
    public PerfilAcessoController(IPerfilAcessoRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PerfilAcessoResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PerfilAcessoResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PerfilAcessoResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<PerfilAcessoResponseDTO>> Create([FromBody] PerfilAcessoRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdPerfil;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PerfilAcessoRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdPerfil = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static PerfilAcesso ToEntity(PerfilAcessoRequestDTO dto) => new()
    {
        Nome = dto.Nome,
        Permissoes = dto.Permissoes,
    };

    private static PerfilAcessoResponseDTO ToResponse(PerfilAcesso entity) => new()
    {
        IdPerfil = entity.IdPerfil,
        Nome = entity.Nome,
        Permissoes = entity.Permissoes,
    };
}
