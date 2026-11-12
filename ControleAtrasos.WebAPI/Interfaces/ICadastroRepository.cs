using ControleAtrasos.Api.Models;
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
    Task SalvarAsync(CancellationToken ct);
    Task SalvarDiaLetivoAsync(DiaCalendario dia, CancellationToken ct);
    Task<IReadOnlyList<HorarioTurma>> HorariosAsync(int? idTurma, CancellationToken ct);
    Task<IReadOnlyList<Matricula>> MatriculasAsync(int? idTurma, CancellationToken ct);
}
