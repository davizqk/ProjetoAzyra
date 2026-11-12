using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class RecorrenciaRepository(AppDbContext db) : IRecorrenciaRepository
{
    public Task<int?> ModeloDaMatriculaAsync(int idMatricula, CancellationToken ct) =>
        (from m in db.Matriculas join t in db.Turmas on m.IdTurma equals t.IdTurma
         where m.IdMatricula == idMatricula select (int?)t.IdModelo).FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<RegraRecorrencia>> RegrasAsync(int idModelo, CancellationToken ct) =>
        await db.RegrasRecorrencia.AsNoTracking().Where(r => r.IdModelo == idModelo && r.Ativa).ToListAsync(ct);

    public async Task<IReadOnlyList<DateTime>> UltimosDiasLetivosAsync(DateTime data, int qtd, CancellationToken ct) =>
        await db.CalendarioLetivo.Where(d => d.DiaLetivo && d.DataLetiva <= data.Date)
            .OrderByDescending(d => d.DataLetiva).Select(d => d.DataLetiva).Take(qtd).ToListAsync(ct);

    public async Task<IReadOnlyList<DateTime>> DatasComAtrasoAsync(int idMatricula, DateTime inicio, DateTime fimExclusivo, CancellationToken ct) =>
        await db.RegistrosAtraso.Where(r => r.IdMatricula == idMatricula &&
            r.DataHoraRegistro >= inicio && r.DataHoraRegistro < fimExclusivo)
            .Select(x => x.DataAtraso).Distinct().ToListAsync(ct);

    public Task<bool> ExisteAlertaAsync(int idMatricula, int idRegra, DateTime data, CancellationToken ct) =>
        db.AlertasRecorrencia.AnyAsync(x => x.IdMatricula == idMatricula && x.IdRegra == idRegra && x.DataFimSequencia == data.Date, ct);

    public void AdicionarAlerta(AlertaRecorrencia alerta) => db.AlertasRecorrencia.Add(alerta);
}
