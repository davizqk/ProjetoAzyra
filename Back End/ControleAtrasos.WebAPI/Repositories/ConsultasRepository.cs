using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class ConsultasRepository(AppDbContext db) : IConsultasRepository
{
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
        int pagina, int tamanho, CancellationToken ct) => PaginadoAsync(idTurma, inicio, fim, pagina, tamanho, ct);

    public Task<PaginaResponse<AtrasoResponse>> AtrasosGestaoAsync(int? idTurma, DateTime inicio, DateTime fim,
        int pagina, int tamanho, CancellationToken ct) => PaginadoAsync(idTurma, inicio, fim, pagina, tamanho, ct);

    private async Task<PaginaResponse<AtrasoResponse>> PaginadoAsync(int? idTurma, DateTime inicio,
        DateTime fim, int pagina, int tamanho, CancellationToken ct)
    {
        var query = from r in db.RegistrosAtraso
                    join m in db.Matriculas on r.IdMatricula equals m.IdMatricula
                    join a in db.Alunos on m.IdAluno equals a.IdAluno
                    join t in db.Turmas on m.IdTurma equals t.IdTurma
                    where (idTurma == null || t.IdTurma == idTurma) &&
                          r.DataHoraRegistro >= inicio && r.DataHoraRegistro < fim
                    select new { Registro = r, Aluno = a.Nome, Turma = t.Nome };

        var total = await query.CountAsync(ct);
        // Ordenar e paginar pelas colunas mapeadas antes de construir o DTO.
        var linhas = await query.OrderByDescending(x => x.Registro.DataHoraRegistro)
            .ThenByDescending(x => x.Registro.IdRegistro)
            .Skip((pagina - 1) * tamanho).Take(tamanho)
            .Select(x => new
            {
                x.Registro.IdRegistro, x.Aluno, x.Turma, x.Registro.DataHoraRegistro,
                x.Registro.HorarioPrevisto, x.Registro.MinutosAtraso
            }).ToListAsync(ct);
        var itens = linhas.Select(x => new AtrasoResponse(x.IdRegistro, x.Aluno, x.Turma,
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
                select new { Alerta = al, Aluno = a.Nome, Turma = t.Nome };
        var total = await q.CountAsync(ct);
        var linhas = await q.OrderByDescending(x => x.Alerta.DataIdentificacao)
            .ThenByDescending(x => x.Alerta.IdAlerta)
            .Skip((pagina - 1) * tamanho).Take(tamanho)
            .Select(x => new
            {
                x.Alerta.IdAlerta, x.Alerta.IdMatricula, x.Aluno, x.Turma,
                x.Alerta.QuantidadeAtrasos, x.Alerta.DataInicioSequencia, x.Alerta.DataFimSequencia,
                x.Alerta.DataIdentificacao, x.Alerta.Status, x.Alerta.Observacao
            }).ToListAsync(ct);
        var itens = linhas.Select(x => new AlertaResponse(x.IdAlerta, x.IdMatricula, x.Aluno, x.Turma,
            x.QuantidadeAtrasos, x.DataInicioSequencia, x.DataFimSequencia,
            x.DataIdentificacao, x.Status, x.Observacao)).ToList();
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
