
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.Aluno;
using Azyra.WebAPI.Models;
using Azyra.WebAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly IAlunoRepository _repository;
    private readonly AzyraContext _context;

    public AlunoController(
        IAlunoRepository repository,
        AzyraContext context)
    {
        _repository = repository;
        _context = context;
    }

    // Listar todos os alunos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AlunoResponseDTO>>> GetAll(
        CancellationToken cancellationToken)
    {
        var alunos = await _context.Alunos
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.IdPeriodoNavigation)
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.HorarioTurmas)
            .ToListAsync(cancellationToken);

        return Ok(alunos.Select(ToResponse));
    }

    // Buscar aluno pelo ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlunoResponseDTO>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var aluno = await _context.Alunos
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.IdPeriodoNavigation)
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.HorarioTurmas)
            .FirstOrDefaultAsync(
                a => a.IdAluno == id,
                cancellationToken
            );

        if (aluno == null)
        {
            return NotFound(new
            {
                mensagem = "Aluno não encontrado."
            });
        }

        return Ok(ToResponse(aluno));
    }

    // Buscar aluno pelo CPF
    [HttpGet("cpf/{cpf}")]
    public async Task<ActionResult<AlunoResponseDTO>> GetByCpf(
        string cpf,
        CancellationToken cancellationToken)
    {
        var cpfNumeros = new string(
            cpf.Where(char.IsDigit).ToArray()
        );

        if (cpfNumeros.Length != 11)
        {
            return BadRequest(new
            {
                mensagem = "CPF inválido."
            });
        }

        var aluno = await _context.Alunos
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.IdPeriodoNavigation)
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.HorarioTurmas)
            .FirstOrDefaultAsync(
                a => a.Cpf == cpfNumeros,
                cancellationToken
            );

        if (aluno == null)
        {
            return NotFound(new
            {
                mensagem = "Aluno não encontrado. Confira o CPF."
            });
        }

        return Ok(ToResponse(aluno));
    }

    // Cadastrar aluno
    [HttpPost]
    public async Task<ActionResult<AlunoResponseDTO>> Create(
        [FromBody] AlunoRequestDTO dto,
        CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);

        var created = await _repository.AddAsync(
            entity,
            cancellationToken
        );

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.IdAluno },
            ToResponse(created)
        );
    }

    // Atualizar aluno
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] AlunoRequestDTO dto,
        CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(
            id,
            cancellationToken
        );

        if (current == null)
        {
            return NotFound(new
            {
                mensagem = "Aluno não encontrado."
            });
        }

        var entity = ToEntity(dto);
        entity.IdAluno = id;

        var updated = await _repository.UpdateAsync(
            id,
            entity,
            cancellationToken
        );

        return updated ? NoContent() : NotFound();
    }

    // Excluir aluno
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(
            id,
            cancellationToken
        );

        return deleted ? NoContent() : NotFound();
    }

    // Converter DTO em entidade
    private static Aluno ToEntity(AlunoRequestDTO dto)
    {
        return new Aluno
        {
            Nome = dto.Nome,

            Cpf = new string(
                dto.Cpf.Where(char.IsDigit).ToArray()
            ),

            IdTurma = dto.IdTurma
        };
    }

    // Converter entidade em DTO
    private static AlunoResponseDTO ToResponse(Aluno aluno)
    {
        var turma = aluno.IdTurmaNavigation;

        var horario = turma?.HorarioTurmas
            .OrderBy(h => h.DiaSemana)
            .FirstOrDefault();

        return new AlunoResponseDTO
        {
            IdAluno = aluno.IdAluno,
            Nome = aluno.Nome,
            Cpf = aluno.Cpf,
            IdTurma = aluno.IdTurma,

            NomeTurma = turma?.Nome ?? "",

            NomePeriodo = turma?.IdPeriodoNavigation?.Nome ?? "",

            HoraInicio = horario?.HoraEntrada.ToString("HH:mm") ?? "",

            ToleranciaMin = horario?.ToleranciaMin ?? 0
        };
    }
}
