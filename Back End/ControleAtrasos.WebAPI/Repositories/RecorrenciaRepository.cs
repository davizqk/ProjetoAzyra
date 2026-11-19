using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using ControleAtrasos.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class RecorrenciaRepository(AppDbContext db) : IRecorrenciaRepository
{
    public Task<int?> ModeloDaMatriculaAsync(int idMatricula, CancellationToken ct) =>
        (from m in db.Matriculas join t in db.Turmas on m.IdTurma equals t.IdTurma
         where m.IdMatricula == idMatricula select (int?)t.IdModelo).FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<RegraRecorrencia>> RegrasAsync(int idModelo, CancellationToken ct) =>
        await db.RegrasRecorrencia.AsNoTracking().Where(r => r.IdModelo == idModelo && r.Ativa).ToListAsync(ct);

    /// <summary>
    /// Seleciona os ultimos dias de aula efetivos da turma (na vigencia da matricula):
    /// calendario geral, excecao da turma e horario semanal vigente.
    /// Datas sem aula para aquela turma nao interrompem a sequencia.
    /// </summary>
    public async Task<IReadOnlyList<DateTime>> UltimosDiasAulaDaTurmaAsync(
        int idMatricula, DateTime data, int quantidade, CancellationToken ct)
    {
        var matricula = await db.Matriculas.AsNoTracking()
            .Where(m => m.IdMatricula == idMatricula)
            .Select(m => new { m.IdTurma, m.DataMatricula, m.DataSaida })
            .FirstOrDefaultAsync(ct);
        if (matricula is null || quantidade <= 0) return [];

        var inicio = matricula.DataMatricula.Date;
        var fim = data.Date;
        if (fim < inicio || matricula.DataSaida < fim) return [];

        // Ha turmas com aulas somente em dois dias da semana. Por isso os dias
        // letivos gerais, isoladamente, NAO podem determinar a consecutividade.
        var diasGerais = await db.CalendarioLetivo.AsNoTracking()
            .Where(d => d.DataLetiva >= inicio && d.DataLetiva <= fim && d.DiaLetivo)
            .Select(d => d.DataLetiva).ToListAsync(ct);
        var diasLetivos = diasGerais.Select(d => d.Date).ToHashSet();

        var excecoes = await db.ExcecoesCalendarioTurma.AsNoTracking()
            .Where(x => x.IdTurma == matricula.IdTurma &&
                        x.DataLetiva >= inicio && x.DataLetiva <= fim)
            .Select(x => new { x.DataLetiva, x.TemAula }).ToListAsync(ct);
        var sobrescritas = excecoes.ToDictionary(x => x.DataLetiva.Date, x => x.TemAula);

        var horarios = await db.HorariosTurmas.AsNoTracking()
            .Where(h => h.IdTurma == matricula.IdTurma && h.Ativo &&
                        h.VigenciaInicio <= fim && (h.VigenciaFim == null || h.VigenciaFim >= inicio))
            .ToListAsync(ct);

        var resultado = new List<DateTime>(quantidade);
        for (var dia = fim; dia >= inicio; dia = dia.AddDays(-1))
        {
            bool? excecao = sobrescritas.TryGetValue(dia, out var temAula) ? temAula : null;
            if (RegrasDiaAula.EhDiaDeAula(dia, diasLetivos.Contains(dia), excecao, horarios))
                resultado.Add(dia);
            if (resultado.Count >= quantidade || dia == inicio) break;
        }
        return resultado;
    }

    public async Task<IReadOnlyList<DateTime>> DatasComAtrasoAsync(int idMatricula, DateTime inicio, DateTime fimExclusivo, CancellationToken ct) =>
        await db.RegistrosAtraso.Where(r => r.IdMatricula == idMatricula &&
            r.DataHoraRegistro >= inicio && r.DataHoraRegistro < fimExclusivo)
            .Select(x => x.DataAtraso).Distinct().ToListAsync(ct);

    public Task<bool> ExisteAlertaAsync(int idMatricula, int idRegra, DateTime data, CancellationToken ct) =>
        db.AlertasRecorrencia.AnyAsync(x => x.IdMatricula == idMatricula && x.IdRegra == idRegra && x.DataFimSequencia == data.Date, ct);

    public void AdicionarAlerta(AlertaRecorrencia alerta) => db.AlertasRecorrencia.Add(alerta);
}
