using Azyra.WebAPI.Data;
using Azyra.WebAPI.DTOs.AlertaRecorrencia;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertaRecorrenciaController : ControllerBase
{
    private readonly AzyraContext _context;
    public AlertaRecorrenciaController(AzyraContext context) => _context = context;

    // Recorrências calculadas a partir do histórico real. Padrão: 3 ou mais atrasos.
    [HttpGet("recorrencias")]
    public async Task<ActionResult<IEnumerable<object>>> GetRecorrencias([FromQuery] int minimo = 3, CancellationToken ct = default)
    {
        if (minimo < 1) return BadRequest("O mínimo deve ser maior que zero.");
        var dados = await _context.HistoricoAtraso.AsNoTracking().Where(h => h.Atrasado)
            .GroupBy(h => h.IdAluno)
            .Select(g => new { IdAluno = g.Key, QuantidadeAtrasos = g.Count(), UltimoAtraso = g.Max(h => h.Data) })
            .Where(x => x.QuantidadeAtrasos >= minimo).ToListAsync(ct);
        var ids = dados.Select(x => x.IdAluno).ToList();
        var alunos = await _context.Aluno.AsNoTracking().Where(a => ids.Contains(a.IdAluno))
            .Join(_context.Turma.AsNoTracking(), a => a.IdTurma, t => t.IdTurma, (a, t) => new { a.IdAluno, a.Nome, NomeTurma = t.Nome })
            .ToDictionaryAsync(a => a.IdAluno, ct);
        var resultado = dados.Select(x => new { x.IdAluno, NomeAluno = alunos[x.IdAluno].Nome, alunos[x.IdAluno].NomeTurma, x.QuantidadeAtrasos, x.UltimoAtraso });
        return Ok(resultado);
    }
}
