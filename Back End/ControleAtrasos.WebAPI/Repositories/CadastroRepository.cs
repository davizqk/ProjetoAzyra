using System.Data;
using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Exceptions;
using ControleAtrasos.Api.Services;
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
    public async Task ExcluirHorarioAsync(int idHorario, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var horario = await HorarioPorIdAsync(idHorario, ct)
            ?? throw new RegraNegocioException(404, "Horário não encontrado.");

        if (await db.RegistrosAtraso.AnyAsync(r => r.IdHorario == idHorario, ct))
            throw new RegraNegocioException(409, "Horário possui atrasos registrados e não pode ser excluído.");

        // A recorrência usa os horários semanais, inclusive nos dias sem atraso.
        // Protege alertas da mesma turma cujo intervalo contém um dia desse horário.
        var inicio = horario.VigenciaInicio.Date;
        var fim = horario.VigenciaFim?.Date ?? DateTime.MaxValue.Date;
        var intervalos = await (from a in db.AlertasRecorrencia.AsNoTracking()
                               join m in db.Matriculas.AsNoTracking() on a.IdMatricula equals m.IdMatricula
                               where m.IdTurma == horario.IdTurma &&
                                     a.DataInicioSequencia <= fim && a.DataFimSequencia >= inicio
                               select new { a.DataInicioSequencia, a.DataFimSequencia }).ToListAsync(ct);
        foreach (var intervalo in intervalos)
        {
            var primeiro = intervalo.DataInicioSequencia.Date > inicio ? intervalo.DataInicioSequencia.Date : inicio;
            var ultimo = intervalo.DataFimSequencia.Date < fim ? intervalo.DataFimSequencia.Date : fim;
            var diasAteHorario = (horario.DiaSemana - RegrasDiaAula.DiaSemana(primeiro) + 7) % 7;
            if ((ultimo - primeiro).Days >= diasAteHorario)
                throw new RegraNegocioException(409, "Horário vinculado ao período de um alerta de recorrência e não pode ser excluído.");
        }

        var agora = DateTime.Now;
        if (await db.SolicitacoesRegistro.AnyAsync(s => s.IdHorario == idHorario &&
                (s.DataConfirmacao != null || s.DataExpiracao >= agora), ct))
            throw new RegraNegocioException(409, "Horário possui solicitações de registro confirmadas ou ainda válidas.");

        // Remove somente tokens expirados e nunca confirmados, que impediriam a exclusão pela FK.
        await db.SolicitacoesRegistro.Where(s => s.IdHorario == idHorario &&
            s.DataConfirmacao == null && s.DataExpiracao < agora).ExecuteDeleteAsync(ct);
        db.HorariosTurmas.Remove(horario);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
    }
    public Task SalvarAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
    private const string DescricaoGerada = "Calendário gerado; revisar feriados e recessos";
    private const string DescricaoGeradaSql = "Calendario inicial - revisar feriados e recessos";
    private static bool FoiGerado(DiaCalendario dia) =>
        dia.Descricao == DescricaoGerada || dia.Descricao == DescricaoGeradaSql;

    private IQueryable<DiaCalendario> DiasDoPeriodo(DateTime inicio, DateTime fim) =>
        db.CalendarioLetivo.Where(d => d.DataLetiva >= inicio && d.DataLetiva <= fim);

    // Protege atrasos e todo o intervalo de alertas existentes. A transação serializável
    // mantém a leitura e a alteração consistentes com a confirmação de novos atrasos.
    private async Task<HashSet<DateTime>> DatasProtegidasAsync(DateTime inicio, DateTime fim, CancellationToken ct)
    {
        var atrasos = await db.RegistrosAtraso.AsNoTracking()
            .Where(x => x.DataAtraso >= inicio && x.DataAtraso <= fim)
            .Select(x => x.DataAtraso).Distinct().ToListAsync(ct);
        var protegidas = atrasos.Select(d => d.Date).ToHashSet();
        var alertas = await db.AlertasRecorrencia.AsNoTracking()
            .Where(x => x.DataInicioSequencia <= fim && x.DataFimSequencia >= inicio)
            .Select(x => new { x.DataInicioSequencia, x.DataFimSequencia }).ToListAsync(ct);
        foreach (var alerta in alertas)
        {
            var primeiro = alerta.DataInicioSequencia.Date < inicio ? inicio : alerta.DataInicioSequencia.Date;
            var ultimo = alerta.DataFimSequencia.Date > fim ? fim : alerta.DataFimSequencia.Date;
            for (var dia = primeiro; dia <= ultimo; dia = dia.AddDays(1)) protegidas.Add(dia);
        }
        return protegidas;
    }

    public async Task<IReadOnlyList<DiaCalendario>> CalendarioAsync(DateTime inicio, DateTime fim, CancellationToken ct) =>
        await DiasDoPeriodo(inicio, fim).AsNoTracking().OrderBy(x => x.DataLetiva).ToListAsync(ct);

    public async Task SalvarDiaLetivoAsync(DiaCalendario dia, CancellationToken ct)
    {
        if (FoiGerado(dia))
            throw new RegraNegocioException(400, "Descrição reservada para datas geradas automaticamente. Informe outra descrição.");
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var exists = await db.CalendarioLetivo.FirstOrDefaultAsync(x => x.DataLetiva == dia.DataLetiva, ct);
        if ((exists is null || exists.DiaLetivo != dia.DiaLetivo) &&
            (await DatasProtegidasAsync(dia.DataLetiva, dia.DataLetiva, ct)).Count > 0)
            throw new RegraNegocioException(409, "Data protegida por atraso ou alerta de recorrência existente.");
        if (exists == null) db.CalendarioLetivo.Add(dia);
        else { exists.DiaLetivo = dia.DiaLetivo; exists.Descricao = dia.Descricao; }
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
    }

    public async Task<int> GerarCalendarioPeriodoAsync(DateTime inicio, DateTime fim,
        IReadOnlyCollection<int> diasSemanaLetivos, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var existentes = await DiasDoPeriodo(inicio, fim).AsNoTracking()
            .Select(d => d.DataLetiva).ToListAsync(ct);
        var datasCadastradas = existentes.Select(d => d.Date).ToHashSet();
        var protegidas = await DatasProtegidasAsync(inicio, fim, ct);
        var novos = new List<DiaCalendario>();
        for (var dia = inicio; dia <= fim; dia = dia.AddDays(1))
        {
            if (datasCadastradas.Contains(dia) || protegidas.Contains(dia)) continue;
            novos.Add(new DiaCalendario {
                DataLetiva = dia,
                DiaLetivo = diasSemanaLetivos.Contains(RegrasDiaAula.DiaSemana(dia)),
                Descricao = DescricaoGerada
            });
        }
        db.CalendarioLetivo.AddRange(novos);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return novos.Count;
    }

    public async Task<ReconfigurarCalendarioResponse> ReconfigurarCalendarioAsync(DateTime inicio, DateTime fim,
        IReadOnlyCollection<int> diasSemanaLetivos, bool preservarExcecoes,
        bool removerDiasNaoLetivos, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var existentes = (await DiasDoPeriodo(inicio, fim).ToListAsync(ct)).ToDictionary(x => x.DataLetiva.Date);
        var protegidas = await DatasProtegidasAsync(inicio, fim, ct);
        var datasProtegidas = new List<DateTime>();
        var manuais = new List<DateTime>();
        int inseridos = 0, atualizados = 0, iguais = 0, excluidos = 0;
        for (var dia = inicio; dia <= fim; dia = dia.AddDays(1))
        {
            if (protegidas.Contains(dia)) { datasProtegidas.Add(dia); continue; }
            bool letivo = diasSemanaLetivos.Contains(RegrasDiaAula.DiaSemana(dia));
            existentes.TryGetValue(dia, out var atual);
            if (atual is not null && preservarExcecoes && !FoiGerado(atual))
            {
                manuais.Add(dia);
                continue;
            }
            // Uma data ausente equivale a um dia geral não letivo na regra de registro.
            // As exceções específicas de turma permanecem independentes.
            if (removerDiasNaoLetivos && !letivo)
            {
                if (atual is null) iguais++;
                else
                {
                    db.CalendarioLetivo.Remove(atual);
                    excluidos++;
                }
                continue;
            }
            if (atual is null)
            {
                db.CalendarioLetivo.Add(new DiaCalendario { DataLetiva = dia, DiaLetivo = letivo, Descricao = DescricaoGerada });
                inseridos++;
            }
            else if (atual.DiaLetivo == letivo && atual.Descricao == DescricaoGerada) iguais++;
            else
            {
                atual.DiaLetivo = letivo;
                atual.Descricao = DescricaoGerada;
                atualizados++;
            }
        }
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return new(inseridos, atualizados, iguais, manuais, datasProtegidas, excluidos);
    }

    public async Task<int> ExcluirCalendarioAsync(DateTime inicio, DateTime fim, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var dias = await DiasDoPeriodo(inicio, fim).ToListAsync(ct);
        if (dias.Count == 0) throw new RegraNegocioException(404, "Nenhuma data de calendário encontrada no período.");
        if ((await DatasProtegidasAsync(inicio, fim, ct)).Count > 0)
            throw new RegraNegocioException(409, "Exclusão bloqueada: o período possui atrasos ou alertas de recorrência. Use a reconfiguração para preservar o histórico.");
        db.CalendarioLetivo.RemoveRange(dias);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return dias.Count;
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
