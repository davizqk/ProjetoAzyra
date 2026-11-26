using ControleAtrasos.Api.Models;
using ControleAtrasos.Api.DTO;
namespace ControleAtrasos.Api.Interfaces;
public interface ICadastroRepository
{
    Task<IReadOnlyList<ModeloEnsino>> ModelosAsync(CancellationToken ct);
    Task<IReadOnlyList<Periodo>> PeriodosAsync(CancellationToken ct);
    Task<IReadOnlyList<Turma>> TurmasAsync(CancellationToken ct);
    Task<Turma?> TurmaPorIdAsync(int id, CancellationToken ct);
    Task<Turma> CriarTurmaAsync(Turma turma, CancellationToken ct);
    Task<bool> ExisteModeloPeriodoAsync(int idModelo, int idPeriodo, CancellationToken ct);
    Task<bool> AlunoTurmaExistemAsync(int idAluno, int idTurma, CancellationToken ct);
    Task<bool> MatriculaSobrepostaAsync(int idAluno, DateTime inicio, DateTime? fim, CancellationToken ct);
    Task<Matricula> CriarMatriculaAsync(Matricula matricula, CancellationToken ct);
    Task<bool> FuncionarioExisteAsync(int idFuncionario, CancellationToken ct);
    Task<ProfessorTurma> AtribuirProfessorAsync(ProfessorTurma vinculo, CancellationToken ct);
    Task<HorarioTurma> CriarHorarioAsync(HorarioTurma horario, CancellationToken ct);
    Task<HorarioTurma?> HorarioPorIdAsync(int idHorario, CancellationToken ct);
    Task ExcluirHorarioAsync(int idHorario, CancellationToken ct);
    Task SalvarAsync(CancellationToken ct);
    Task SalvarDiaLetivoAsync(DiaCalendario dia, CancellationToken ct);
    Task<int> GerarCalendarioPeriodoAsync(DateTime inicio, DateTime fim,
        IReadOnlyCollection<int> diasSemanaLetivos, CancellationToken ct);
    Task<IReadOnlyList<DiaCalendario>> CalendarioAsync(DateTime inicio, DateTime fim, CancellationToken ct);
    Task<ReconfigurarCalendarioResponse> ReconfigurarCalendarioAsync(DateTime inicio, DateTime fim,
        IReadOnlyCollection<int> diasSemanaLetivos, bool preservarExcecoes,
        bool removerDiasNaoLetivos, CancellationToken ct);
    Task<int> ExcluirCalendarioAsync(DateTime inicio, DateTime fim, CancellationToken ct);
    Task<ExcecaoCalendarioTurma> SalvarExcecaoAsync(ExcecaoCalendarioTurma excecao, CancellationToken ct);
    Task<IReadOnlyList<ExcecaoCalendarioTurma>> ExcecoesAsync(
        int idTurma, DateTime inicio, DateTime fim, CancellationToken ct);
    Task<bool> ExcluirExcecaoAsync(int idTurma, DateTime data, CancellationToken ct);
    Task<IReadOnlyList<HorarioTurma>> HorariosAsync(int? idTurma, CancellationToken ct);
    Task<IReadOnlyList<Matricula>> MatriculasAsync(int? idTurma, CancellationToken ct);
}
