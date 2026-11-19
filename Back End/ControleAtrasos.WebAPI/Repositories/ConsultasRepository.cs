using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class ConsultasRepository(AppDbContext db) : IConsultasRepository
{
    private sealed record AtrasoLinha(int IdRegistro, string Aluno, string Matricula, string Turma,
        DateTime DataHoraRegistro, TimeSpan HorarioPrevisto, int MinutosAtraso);

    private IQueryable<AtrasoLinha> ConsultaAtrasos() =>
        from r in db.RegistrosAtraso
        join m in db.Matriculas on r.IdMatricula equals m.IdMatricula
        join a in db.Alunos on m.IdAluno equals a.IdAluno
        join t in db.Turmas on m.IdTurma equals t.IdTurma
        select new AtrasoLinha(r.IdRegistro, a.Nome, a.Matricula, t.Nome,
            r.DataHoraRegistro, r.HorarioPrevisto, r.MinutosAtraso);

    public async Task<IReadOnlyList<object>> TurmasDoProfessorAsync(int idUsuario, DateTime data, CancellationToken ct)
    {
        var result = await (from f in db.Funcionarios
                            join pt in db.ProfessorTurmas on f.IdFuncionario equals pt.IdFuncionario
                            join t in db.Turmas on pt.IdTurma equals t.IdTurma
                            where f.IdUsuario == idUsuario && pt.DataInicio <= data &&
                                (pt.DataFim == null || pt.DataFim >= data)
                            select new { t.IdTurma, t.Nome, t.AnoLetivo }).Distinct().ToListAsync(ct);
        return result.Cast<object>().ToArray();
    }

    public Task<bool> PodeVerTurmaAsync(int idUsuario, int idTurma, DateTime data, bool gestao, CancellationToken ct)
    {
        if (gestao) return Task.FromResult(true);
        return (from f in db.Funcionarios join pt in db.ProfessorTurmas on f.IdFuncionario equals pt.IdFuncionario
                where f.IdUsuario == idUsuario && pt.IdTurma == idTurma && pt.DataInicio <= data &&
                      (pt.DataFim == null || pt.DataFim >= data)
                select pt.IdProfessorTurma).AnyAsync(ct);
    }

    public Task<PaginaResponse<AtrasoResponse>> AtrasosDaTurmaAsync(int idTurma, DateTime inicio, DateTime fim,
        int pagina, int tamanho, CancellationToken ct) => PaginadoAsync(
        from r in db.RegistrosAtraso
        join m in db.Matriculas on r.IdMatricula equals m.IdMatricula
        join a in db.Alunos on m.IdAluno equals a.IdAluno
        join t in db.Turmas on m.IdTurma equals t.IdTurma
        where t.IdTurma == idTurma && r.DataHoraRegistro >= inicio && r.DataHoraRegistro < fim
        select new AtrasoLinha(r.IdRegistro, a.Nome, a.Matricula, t.Nome, r.DataHoraRegistro,
            r.HorarioPrevisto, r.MinutosAtraso), pagina, tamanho, ct);

    public Task<PaginaResponse<AtrasoResponse>> AtrasosGestaoAsync(int? idTurma, DateTime inicio, DateTime fim,
        int pagina, int tamanho, CancellationToken ct) => PaginadoAsync(
        from r in db.RegistrosAtraso
        join m in db.Matriculas on r.IdMatricula equals m.IdMatricula
        join a in db.Alunos on m.IdAluno equals a.IdAluno
        join t in db.Turmas on m.IdTurma equals t.IdTurma
        where (idTurma == null || t.IdTurma == idTurma) && r.DataHoraRegistro >= inicio && r.DataHoraRegistro < fim
        select new AtrasoLinha(r.IdRegistro, a.Nome, a.Matricula, t.Nome, r.DataHoraRegistro,
            r.HorarioPrevisto, r.MinutosAtraso), pagina, tamanho, ct);

    private static async Task<PaginaResponse<AtrasoResponse>> PaginadoAsync(IQueryable<AtrasoLinha> query,
        int pagina, int tamanho, CancellationToken ct)
    {
        var total = await query.CountAsync(ct);
        var linhas = await query.OrderByDescending(x => x.DataHoraRegistro).ThenByDescending(x => x.IdRegistro)
            .Skip((pagina - 1) * tamanho).Take(tamanho).ToListAsync(ct);
        var itens = linhas.Select(x => new AtrasoResponse(x.IdRegistro, x.Aluno, x.Matricula, x.Turma,
            x.DataHoraRegistro, x.HorarioPrevisto.ToString(@"hh\:mm"), x.MinutosAtraso)).ToList();
        return new(itens, pagina, tamanho, total);
    }

    public async Task<IndicadoresResponse> IndicadoresAsync(DateTime inicio, DateTime fim, CancellationToken ct)
    {
        var q = db.RegistrosAtraso.Where(x => x.DataHoraRegistro >= inicio && x.DataHoraRegistro < fim);
        var total = await q.CountAsync(ct);
        var distintos = await q.Select(x => x.IdMatricula).Distinct().CountAsync(ct);
        var media = await q.AverageAsync(x => (double?)x.MinutosAtraso, ct) ?? 0;
        return new(total, distintos, media);
    }

    public async Task<PaginaResponse<AlertaResponse>> AlertasAsync(string? status, int pagina, int tamanho, CancellationToken ct)
    {
        var q = from al in db.AlertasRecorrencia join m in db.Matriculas on al.IdMatricula equals m.IdMatricula
                join a in db.Alunos on m.IdAluno equals a.IdAluno
                join t in db.Turmas on m.IdTurma equals t.IdTurma
                where status == null || al.Status == status
                select new AlertaResponse(al.IdAlerta, al.IdMatricula, a.Nome, t.Nome,
                    al.QuantidadeAtrasos, al.DataInicioSequencia, al.DataFimSequencia,
                    al.DataIdentificacao, al.Status, al.Observacao);
        var total = await q.CountAsync(ct);
        var itens = await q.OrderByDescending(x => x.DataIdentificacao).ThenByDescending(x => x.IdAlerta)
            .Skip((pagina-1)*tamanho).Take(tamanho).ToListAsync(ct);
        return new(itens, pagina, tamanho, total);
    }

    public async Task<bool> AlterarAlertaAsync(int idAlerta, string status, string? observacao, CancellationToken ct)
    {
        var alerta = await db.AlertasRecorrencia.FirstOrDefaultAsync(x => x.IdAlerta == idAlerta, ct);
        if (alerta == null) return false;
        alerta.Status = status;
        alerta.Observacao = observacao;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
