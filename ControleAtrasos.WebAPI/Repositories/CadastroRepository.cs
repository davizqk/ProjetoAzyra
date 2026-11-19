using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class CadastroRepository(AppDbContext db) : ICadastroRepository
{
    public async Task<IReadOnlyList<ModeloEnsino>> ModelosAsync(CancellationToken ct) =>
        await db.ModelosEnsino.AsNoTracking().OrderBy(x => x.Nome).ToListAsync(ct);
    public async Task<IReadOnlyList<Periodo>> PeriodosAsync(CancellationToken ct) =>
        await db.Periodos.AsNoTracking().OrderBy(x => x.Nome).ToListAsync(ct);
    public async Task<IReadOnlyList<Turma>> TurmasAsync(CancellationToken ct) =>
        await db.Turmas.AsNoTracking().OrderBy(x => x.Nome).ToListAsync(ct);
    public Task<Turma?> TurmaPorIdAsync(int id, CancellationToken ct) =>
        db.Turmas.FirstOrDefaultAsync(x => x.IdTurma == id, ct);
    public async Task<Turma> CriarTurmaAsync(Turma turma, CancellationToken ct)
    { db.Turmas.Add(turma); await db.SaveChangesAsync(ct); return turma; }
    public async Task<bool> ExisteModeloPeriodoAsync(int idModelo, int idPeriodo, CancellationToken ct) =>
        await db.ModelosEnsino.AnyAsync(x => x.IdModelo == idModelo, ct) &&
        await db.Periodos.AnyAsync(x => x.IdPeriodo == idPeriodo, ct);
    public async Task<bool> AlunoTurmaExistemAsync(int idAluno, int idTurma, CancellationToken ct) =>
        await db.Alunos.AnyAsync(x => x.IdAluno == idAluno && x.Ativo, ct) &&
        await db.Turmas.AnyAsync(x => x.IdTurma == idTurma && x.Ativa, ct);
    public Task<bool> MatriculaSobrepostaAsync(int idAluno, DateTime inicio, DateTime? fim, CancellationToken ct) =>
        db.Matriculas.AnyAsync(x => x.IdAluno == idAluno && x.DataMatricula <= (fim ?? DateTime.MaxValue) &&
            (x.DataSaida == null || x.DataSaida >= inicio), ct);
    public async Task<Matricula> CriarMatriculaAsync(Matricula matricula, CancellationToken ct)
    { db.Matriculas.Add(matricula); await db.SaveChangesAsync(ct); return matricula; }
    public Task<bool> FuncionarioExisteAsync(int idFuncionario, CancellationToken ct) =>
        db.Funcionarios.AnyAsync(x => x.IdFuncionario == idFuncionario, ct);
    public async Task<ProfessorTurma> AtribuirProfessorAsync(ProfessorTurma vinculo, CancellationToken ct)
    { db.ProfessorTurmas.Add(vinculo); await db.SaveChangesAsync(ct); return vinculo; }
    public async Task<HorarioTurma> CriarHorarioAsync(HorarioTurma horario, CancellationToken ct)
    { db.HorariosTurmas.Add(horario); await db.SaveChangesAsync(ct); return horario; }
    public Task<HorarioTurma?> HorarioPorIdAsync(int idHorario, CancellationToken ct) =>
        db.HorariosTurmas.FirstOrDefaultAsync(x => x.IdHorario == idHorario, ct);
    public Task SalvarAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
    public async Task SalvarDiaLetivoAsync(DiaCalendario dia, CancellationToken ct)
    {
        var exists = await db.CalendarioLetivo.FirstOrDefaultAsync(x => x.DataLetiva == dia.DataLetiva, ct);
        if (exists == null) db.CalendarioLetivo.Add(dia);
        else { exists.DiaLetivo = dia.DiaLetivo; exists.Descricao = dia.Descricao; }
        await db.SaveChangesAsync(ct);
    }
    public async Task<int> GerarCalendarioPeriodoAsync(DateTime inicio, DateTime fim,
        IReadOnlyCollection<int> diasSemanaLetivos, CancellationToken ct)
    {
        var existentes = await db.CalendarioLetivo.AsNoTracking()
            .Where(d => d.DataLetiva >= inicio.Date && d.DataLetiva <= fim.Date)
            .Select(d => d.DataLetiva).ToListAsync(ct);
        var datasCadastradas = existentes.Select(d => d.Date).ToHashSet();
        var novos = new List<DiaCalendario>();
        for (var dia = inicio.Date; dia <= fim.Date; dia = dia.AddDays(1))
        {
            if (datasCadastradas.Contains(dia)) continue; // nao sobrescreve feriados existentes
            novos.Add(new DiaCalendario {
                DataLetiva = dia,
                DiaLetivo = diasSemanaLetivos.Contains(ControleAtrasos.Api.Services.RegrasDiaAula.DiaSemana(dia)),
                Descricao = "Calendário gerado; revisar feriados e recessos"
            });
        }
        db.CalendarioLetivo.AddRange(novos);
        await db.SaveChangesAsync(ct);
        return novos.Count;
    }
    public async Task<ExcecaoCalendarioTurma> SalvarExcecaoAsync(
        ExcecaoCalendarioTurma excecao, CancellationToken ct)
    {
        var atual = await db.ExcecoesCalendarioTurma.FindAsync(
            [excecao.IdTurma, excecao.DataLetiva], ct);
        if (atual is null) db.ExcecoesCalendarioTurma.Add(excecao);
        else { atual.TemAula = excecao.TemAula; atual.Motivo = excecao.Motivo; }
        await db.SaveChangesAsync(ct);
        return atual ?? excecao;
    }
    public async Task<IReadOnlyList<ExcecaoCalendarioTurma>> ExcecoesAsync(
        int idTurma, DateTime inicio, DateTime fim, CancellationToken ct) =>
        await db.ExcecoesCalendarioTurma.AsNoTracking()
            .Where(x => x.IdTurma == idTurma && x.DataLetiva >= inicio.Date && x.DataLetiva <= fim.Date)
            .OrderBy(x => x.DataLetiva).ToListAsync(ct);
    public async Task<bool> ExcluirExcecaoAsync(int idTurma, DateTime data, CancellationToken ct)
    {
        var excecao = await db.ExcecoesCalendarioTurma.FindAsync([idTurma, data.Date], ct);
        if (excecao is null) return false;
        db.ExcecoesCalendarioTurma.Remove(excecao);
        await db.SaveChangesAsync(ct);
        return true;
    }
    public async Task<IReadOnlyList<HorarioTurma>> HorariosAsync(int? idTurma, CancellationToken ct) =>
        await db.HorariosTurmas.AsNoTracking().Where(x => idTurma == null || x.IdTurma == idTurma)
            .OrderBy(x => x.IdTurma).ThenBy(x => x.DiaSemana).ToListAsync(ct);
    public async Task<IReadOnlyList<Matricula>> MatriculasAsync(int? idTurma, CancellationToken ct) =>
        await db.Matriculas.AsNoTracking().Where(x => idTurma == null || x.IdTurma == idTurma)
            .OrderByDescending(x => x.IdMatricula).Take(1000).ToListAsync(ct);
}
