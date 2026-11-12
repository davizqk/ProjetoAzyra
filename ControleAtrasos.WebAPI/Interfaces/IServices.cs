using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Models;
namespace ControleAtrasos.Api.Interfaces;
public interface ISegurancaService
{
    string NormalizarCpf(string cpf);
    bool ValidarCpf(string cpf);
    byte[] HashCpf(string cpfNormalizado);
    string NovoToken();
    byte[] HashToken(string token);
}
public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest req, CancellationToken ct);
}
public interface IRegistroService
{
    Task<IdentificarResponse> IdentificarAsync(string cpf, CancellationToken ct);
    Task<ConfirmarResponse> ConfirmarAsync(string token, CancellationToken ct);
}
public interface IRecorrenciaService
{
    Task VerificarAsync(int idMatricula, DateTime data, CancellationToken ct);
}
public interface IAdministracaoService
{
    Task<AlunoResponse> CriarAlunoAsync(CriarAlunoRequest req, CancellationToken ct);
    Task<AlunoResponse> AtualizarAlunoAsync(int id, AtualizarAlunoRequest req, CancellationToken ct);
    Task<IReadOnlyList<AlunoResponse>> AlunosAsync(CancellationToken ct);
    Task<FuncionarioResponse> CriarFuncionarioAsync(CriarFuncionarioRequest req, CancellationToken ct);
    Task<IReadOnlyList<FuncionarioResponse>> FuncionariosAsync(CancellationToken ct);
    Task<FuncionarioResponse> AtualizarFuncionarioAsync(int id, AtualizarFuncionarioRequest req, CancellationToken ct);
    Task<Turma> CriarTurmaAsync(CriarTurmaRequest req, CancellationToken ct);
    Task<Turma> AtualizarTurmaAsync(int id, AtualizarTurmaRequest req, CancellationToken ct);
    Task<Matricula> CriarMatriculaAsync(CriarMatriculaRequest req, CancellationToken ct);
    Task<ProfessorTurma> VincularProfessorAsync(CriarProfessorTurmaRequest req, CancellationToken ct);
    Task<HorarioTurma> CriarHorarioAsync(CriarHorarioRequest req, CancellationToken ct);
    Task<HorarioTurma> AtualizarHorarioAsync(int id, AtualizarHorarioRequest req, CancellationToken ct);
    Task AtualizarDiaLetivoAsync(DateTime data, CalendarioRequest req, CancellationToken ct);
}
