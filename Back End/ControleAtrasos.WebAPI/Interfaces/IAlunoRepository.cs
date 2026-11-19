using ControleAtrasos.Api.Models;
namespace ControleAtrasos.Api.Interfaces;
public interface IAlunoRepository
{
    Task<Aluno?> PorCpfHashAsync(byte[] hash, CancellationToken ct);
    Task<MatriculaAtiva?> MatriculaAtivaAsync(int idAluno, DateTime data, CancellationToken ct);
    Task<Aluno?> PorIdAsync(int id, CancellationToken ct);
    Task<bool> CpfOuMatriculaExisteAsync(byte[] hash, string numeroMatricula, CancellationToken ct);
    Task<Aluno> CriarAsync(Aluno aluno, CancellationToken ct);
    Task SalvarAsync(CancellationToken ct);
    Task<IReadOnlyList<Aluno>> ListarAsync(CancellationToken ct);
}
public sealed record MatriculaAtiva(int IdMatricula, int IdTurma, string NomeTurma, int IdModelo);
