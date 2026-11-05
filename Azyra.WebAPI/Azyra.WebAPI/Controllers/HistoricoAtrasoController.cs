
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.DTOs.HistoricoAtraso;
using Azyra.WebAPI.Models;
using Azyra.WebAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoricoAtrasoController : ControllerBase
{
    private readonly IHistoricoAtrasoRepository _repository;
    private readonly AzyraContext _context;

    public HistoricoAtrasoController(
        IHistoricoAtrasoRepository repository,
        AzyraContext context)
    {
        _repository = repository;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HistoricoAtrasoResponseDTO>>> GetAll(
        CancellationToken cancellationToken)
    {
        var registros = await _context.HistoricoAtrasos
            .Include(h => h.IdAlunoNavigation)
                .ThenInclude(a => a.IdTurmaNavigation)
            .OrderByDescending(h => h.Data)
            .ToListAsync(cancellationToken);

        return Ok(registros.Select(ToResponse));
    }

    // Buscar histórico de um aluno específico
    [HttpGet("aluno/{idAluno:int}")]
    public async Task<ActionResult<IEnumerable<HistoricoAtrasoResponseDTO>>> GetByAluno(
        int idAluno,
        CancellationToken cancellationToken)
    {
        var registros = await _context.HistoricoAtrasos
            .Include(h => h.IdAlunoNavigation)
                .ThenInclude(a => a.IdTurmaNavigation)
            .Where(h => h.IdAluno == idAluno)
            .OrderByDescending(h => h.Data)
            .ToListAsync(cancellationToken);

        return Ok(registros.Select(ToResponse));
    }

    // Registrar chegada automaticamente
    [HttpPost("registrar-chegada")]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> RegistrarChegada(
        [FromBody] RegistrarChegadaDTO dto,
        CancellationToken cancellationToken)
    {
        var aluno = await _context.Alunos
            .Include(a => a.IdTurmaNavigation)
                .ThenInclude(t => t.HorarioTurmas)
            .FirstOrDefaultAsync(
                a => a.IdAluno == dto.IdAluno,
                cancellationToken
            );

        if (aluno == null)
            return NotFound(new
            {
                mensagem = "Aluno não encontrado."
            });

        var agora = DateTime.Now;
        var dataAtual = DateOnly.FromDateTime(agora);
        var horaAtual = TimeOnly.FromDateTime(agora);

        // Segunda-feira = 1 e domingo = 7.
        var diaSemana = ((int)agora.DayOfWeek + 6) % 7 + 1;

        var horario = aluno.IdTurmaNavigation.HorarioTurmas
            .FirstOrDefault(h => h.DiaSemana == diaSemana);

        if (horario == null)
            return BadRequest(new
            {
                mensagem = "Não existe horário cadastrado para a turma neste dia."
            });

        var horarioLimite = horario.HoraEntrada.AddMinutes(
            horario.ToleranciaMin
        );

        var atrasado = horaAtual > horarioLimite;

        // Verifica se já existe registro para o aluno hoje.
        var registro = await _context.HistoricoAtrasos
            .FirstOrDefaultAsync(
                h => h.IdAluno == dto.IdAluno
                && h.Data == dataAtual,
                cancellationToken
            );

        if (registro == null)
        {
            registro = new HistoricoAtraso
            {
                IdAluno = dto.IdAluno,
                Data = dataAtual
            };

            _context.HistoricoAtrasos.Add(registro);
        }

        registro.Atrasado = atrasado;
        registro.HoraChegada = horaAtual;

        // Atualiza o contador com base nos registros anteriores.
        var registrosAnteriores = await _context.HistoricoAtrasos
            .Where(h =>
                h.IdAluno == dto.IdAluno &&
                h.Data < dataAtual &&
                h.Atrasado)
            .OrderByDescending(h => h.Data)
            .Select(h => h.Data)
            .Take(30)
            .ToListAsync(cancellationToken);

        int consecutivos = 0;
        var diaEsperado = dataAtual.AddDays(-1);

        foreach (var dia in registrosAnteriores)
        {
            if (dia != diaEsperado)
                break;

            consecutivos++;
            diaEsperado = diaEsperado.AddDays(-1);
        }

        registro.ConsecutivoAtual = atrasado
            ? consecutivos + 1
            : 0;

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new HistoricoAtrasoResponseDTO
        {
            IdHistorico = registro.IdHistorico,
            IdAluno = registro.IdAluno,
            Data = registro.Data.ToDateTime(TimeOnly.MinValue),
            Atrasado = registro.Atrasado,
            ConsecutivoAtual = registro.ConsecutivoAtual,
            HoraChegada = registro.HoraChegada,
            NomeTurma = aluno.IdTurmaNavigation.Nome
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var registro = await _context.HistoricoAtrasos
            .Include(h => h.IdAlunoNavigation)
                .ThenInclude(a => a.IdTurmaNavigation)
            .FirstOrDefaultAsync(
                h => h.IdHistorico == id,
                cancellationToken
            );

        if (registro == null)
            return NotFound();

        return Ok(ToResponse(registro));
    }

    [HttpPost]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> Create(
        [FromBody] HistoricoAtrasoRequestDTO dto,
        CancellationToken cancellationToken)
    {
        var entity = ToEntity(dto);

        var created = await _repository.AddAsync(
            entity,
            cancellationToken
        );

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.IdHistorico },
            ToResponse(created)
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] HistoricoAtrasoRequestDTO dto,
        CancellationToken cancellationToken)
    {
        var current = await _repository.GetByIdAsync(
            id,
            cancellationToken
        );

        if (current == null)
            return NotFound();

        var entity = ToEntity(dto);
        entity.IdHistorico = id;

        var updated = await _repository.UpdateAsync(
            id,
            entity,
            cancellationToken
        );

        return updated ? NoContent() : NotFound();
    }

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

    private static HistoricoAtraso ToEntity(
        HistoricoAtrasoRequestDTO dto)
    {
        return new HistoricoAtraso
        {
            IdAluno = dto.IdAluno,
            Data = DateOnly.FromDateTime(dto.Data),
            Atrasado = dto.Atrasado,
            ConsecutivoAtual = dto.ConsecutivoAtual,
            HoraChegada = dto.HoraChegada
        };
    }

    private static HistoricoAtrasoResponseDTO ToResponse(
        HistoricoAtraso registro)
    {
        return new HistoricoAtrasoResponseDTO
        {
            IdHistorico = registro.IdHistorico,
            IdAluno = registro.IdAluno,
            Data = registro.Data.ToDateTime(TimeOnly.MinValue),
            Atrasado = registro.Atrasado,
            ConsecutivoAtual = registro.ConsecutivoAtual,
            HoraChegada = registro.HoraChegada,
            NomeTurma = registro.IdAlunoNavigation?
                .IdTurmaNavigation?.Nome ?? ""
        };
    }
}
