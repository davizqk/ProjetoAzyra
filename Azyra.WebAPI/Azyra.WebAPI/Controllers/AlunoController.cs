using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.Aluno;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly IAlunoRepository _repository;
    public AlunoController(IAlunoRepository repository) => _repository = repository;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AlunoResponseDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AlunoResponseDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlunoResponseDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _repository.GetByIdAsync(id, cancellationToken);
        if (item is null) return NotFound();
        return Ok(ToResponse(item));
    }

    [HttpPost]
    public async Task<ActionResult<AlunoResponseDTO>> Create([FromBody] AlunoRequestDTO dto, CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);
        var created = await _repository.AddAsync(entity, cancellationToken);
        var id = created.IdAluno;
        return CreatedAtAction(nameof(GetById), new { id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] AlunoRequestDTO dto, CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(id, cancellationToken);
        if (current is null) return NotFound();
        var entity = ToEntity(dto);
        entity.IdAluno = id;
        var updated = await _repository.UpdateAsync(id, entity, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static Aluno ToEntity(AlunoRequestDTO dto) => new()
    {
        Nome = dto.Nome,
        Matricula = dto.Matricula,
        IdTurma = dto.IdTurma,
    };

    private static AlunoResponseDTO ToResponse(Aluno entity) => new()
    {
        IdAluno = entity.IdAluno,
        Nome = entity.Nome,
        Matricula = entity.Matricula,
        IdTurma = entity.IdTurma,
    };
}
