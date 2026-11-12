using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace ControleAtrasos.Api.Repositories;
public sealed class RegistroRepository(AppDbContext db) : IRegistroRepository
{
    public Task<bool> EhLetivoAsync(DateTime data, CancellationToken ct) =>
        db.CalendarioLetivo.AnyAsync(x => x.DataLetiva == data.Date && x.DiaLetivo, ct);

    public Task<HorarioTurma?> HorarioAsync(int idTurma, DateTime data, int diaSemana, CancellationToken ct) =>
        db.HorariosTurmas.Where(x => x.IdTurma == idTurma && x.DiaSemana == diaSemana && x.Ativo &&
            x.VigenciaInicio <= data.Date && (x.VigenciaFim == null || x.VigenciaFim >= data.Date))
            .OrderByDescending(x => x.VigenciaInicio).FirstOrDefaultAsync(ct);

    public Task<bool> JaExisteAtrasoAsync(int idMatricula, DateTime data, CancellationToken ct) =>
        db.RegistrosAtraso.AnyAsync(x => x.IdMatricula == idMatricula &&
            x.DataHoraRegistro >= data.Date && x.DataHoraRegistro < data.Date.AddDays(1), ct);

    public async Task CriarSolicitacaoAsync(SolicitacaoRegistro solicitacao, CancellationToken ct)
    {
        db.SolicitacoesRegistro.Add(solicitacao);
        await db.SaveChangesAsync(ct);
    }

    public Task<SolicitacaoRegistro?> BuscarSolicitacaoAsync(byte[] hash, CancellationToken ct) =>
        db.SolicitacoesRegistro.FirstOrDefaultAsync(x => x.TokenHash == hash, ct);
    public Task<Matricula?> MatriculaAsync(int id, CancellationToken ct) =>
        db.Matriculas.FirstOrDefaultAsync(x => x.IdMatricula == id, ct);
    public Task<HorarioTurma?> HorarioPorIdAsync(int id, CancellationToken ct) =>
        db.HorariosTurmas.FirstOrDefaultAsync(x => x.IdHorario == id, ct);
    public async Task<bool> AlunoTurmaAtivosAsync(Matricula m, CancellationToken ct) =>
        await db.Alunos.AnyAsync(x => x.IdAluno == m.IdAluno && x.Ativo, ct) &&
        await db.Turmas.AnyAsync(x => x.IdTurma == m.IdTurma && x.Ativa, ct);

    public Task<IDbContextTransaction> IniciarTransacaoAsync(CancellationToken ct) =>
        db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable, ct);

    public Task AdicionarAtrasoAsync(RegistroAtraso atraso, CancellationToken ct)
    {
        db.RegistrosAtraso.Add(atraso);
        return Task.CompletedTask;
    }
    public Task SalvarAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
}
