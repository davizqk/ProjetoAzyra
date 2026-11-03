using Azyra.WebAPI.Data;
using Azyra.WebAPI.DTOs.HistoricoAtraso;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoricoAtrasoController : ControllerBase
{
    private readonly AzyraContext _context;
    public HistoricoAtrasoController(AzyraContext context) => _context = context;

    // Retorna o histórico com o nome do aluno e da turma.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HistoricoAtrasoResponseDTO>>> GetAll(CancellationToken ct)
    {
        var items = await _context.HistoricoAtraso.AsNoTracking()
            .Join(_context.Aluno.AsNoTracking(), h => h.IdAluno, a => a.IdAluno, (h, a) => new { h, a })
            .Join(_context.Turma.AsNoTracking(), x => x.a.IdTurma, t => t.IdTurma, (x, t) => new HistoricoAtrasoResponseDTO
            {
                IdHistorico = x.h.IdHistorico, IdAluno = x.a.IdAluno, NomeAluno = x.a.Nome,
                NomeTurma = t.Nome, Data = x.h.Data, HoraChegada = x.h.HoraChegada,
                Atrasado = x.h.Atrasado, ConsecutivoAtual = x.h.ConsecutivoAtual
            }).OrderByDescending(x => x.Data).ToListAsync(ct);
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> GetById(int id, CancellationToken ct)
    {
        var item = await _context.HistoricoAtraso.AsNoTracking().Where(h => h.IdHistorico == id)
            .Join(_context.Aluno.AsNoTracking(), h => h.IdAluno, a => a.IdAluno, (h, a) => new { h, a })
            .Join(_context.Turma.AsNoTracking(), x => x.a.IdTurma, t => t.IdTurma, (x, t) => new HistoricoAtrasoResponseDTO
            {
                IdHistorico = x.h.IdHistorico, IdAluno = x.a.IdAluno, NomeAluno = x.a.Nome,
                NomeTurma = t.Nome, Data = x.h.Data, HoraChegada = x.h.HoraChegada,
                Atrasado = x.h.Atrasado, ConsecutivoAtual = x.h.ConsecutivoAtual
            }).FirstOrDefaultAsync(ct);
        return item is null ? NotFound() : Ok(item);
    }

    // A API identifica o aluno pelo CPF e calcula o atraso usando o horário da turma.
    [HttpPost]
    public async Task<ActionResult<HistoricoAtrasoResponseDTO>> Create([FromBody] HistoricoAtrasoRequestDTO dto, CancellationToken ct)
    {
        var cpf = new string((dto.CPF ?? string.Empty).Where(char.IsDigit).ToArray());
        if (cpf.Length != 11) return BadRequest("Informe um CPF válido com 11 dígitos.");

        var aluno = await _context.Aluno.FirstOrDefaultAsync(a => a.CPF != null && a.CPF.Replace(".", "").Replace("-", "") == cpf, ct);
        if (aluno is null) return NotFound("Aluno não encontrado para o CPF informado.");

        var chegada = dto.DataHoraChegada ?? DateTime.Now;
        var diaSemana = ((int)chegada.DayOfWeek + 6) % 7 + 1; // segunda=1 ... domingo=7
        var horario = await _context.HorarioTurma.FirstOrDefaultAsync(h => h.IdTurma == aluno.IdTurma && h.DiaSemana == diaSemana, ct);
        if (horario is null) return BadRequest("Não há horário cadastrado para a turma neste dia da semana.");

        var horaChegada = chegada.TimeOfDay;
        var limite = horario.HoraEntrada.Add(TimeSpan.FromMinutes(horario.ToleranciaMin));
        var atrasado = horaChegada > limite;
        var data = chegada.Date;

        var jaRegistrado = await _context.HistoricoAtraso.AnyAsync(h => h.IdAluno == aluno.IdAluno && h.Data.Date == data, ct);
        if (jaRegistrado) return Conflict("Já existe um registro para este aluno nesta data.");

        var anteriores = await _context.HistoricoAtraso.Where(h => h.IdAluno == aluno.IdAluno && h.Data < data)
            .OrderByDescending(h => h.Data).Take(60).ToListAsync(ct);
        var consecutivo = 0;
        if (atrasado)
        {
            foreach (var anterior in anteriores)
            {
                if (!anterior.Atrasado) break;
                consecutivo++;
            }
            consecutivo++;
        }

        var entity = new HistoricoAtraso { IdAluno = aluno.IdAluno, Data = chegada, HoraChegada = horaChegada, Atrasado = atrasado, ConsecutivoAtual = consecutivo };
        _context.HistoricoAtraso.Add(entity);
        await _context.SaveChangesAsync(ct);

        var turma = await _context.Turma.AsNoTracking().FirstAsync(t => t.IdTurma == aluno.IdTurma, ct);
        var response = new HistoricoAtrasoResponseDTO { IdHistorico = entity.IdHistorico, IdAluno = aluno.IdAluno, NomeAluno = aluno.Nome, NomeTurma = turma.Nome, Data = entity.Data, HoraChegada = entity.HoraChegada, Atrasado = entity.Atrasado, ConsecutivoAtual = entity.ConsecutivoAtual };
        return CreatedAtAction(nameof(GetById), new { id = entity.IdHistorico }, response);
    }
}
