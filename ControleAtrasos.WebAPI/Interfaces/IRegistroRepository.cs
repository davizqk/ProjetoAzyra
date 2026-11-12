using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore.Storage;
namespace ControleAtrasos.Api.Interfaces;
public interface IRegistroRepository
{
    Task<bool> EhLetivoAsync(DateTime data, CancellationToken ct);
    Task<HorarioTurma?> HorarioAsync(int idTurma, DateTime data, int diaSemana, CancellationToken ct);
    Task<bool> JaExisteAtrasoAsync(int idMatricula, DateTime data, CancellationToken ct);
    Task CriarSolicitacaoAsync(SolicitacaoRegistro solicitacao, CancellationToken ct);
    Task<SolicitacaoRegistro?> BuscarSolicitacaoAsync(byte[] tokenHash, CancellationToken ct);
    Task<Matricula?> MatriculaAsync(int id, CancellationToken ct);
    Task<HorarioTurma?> HorarioPorIdAsync(int id, CancellationToken ct);
    Task<bool> AlunoTurmaAtivosAsync(Matricula m, CancellationToken ct);
    Task<IDbContextTransaction> IniciarTransacaoAsync(CancellationToken ct);
    Task AdicionarAtrasoAsync(RegistroAtraso atraso, CancellationToken ct);
    Task SalvarAsync(CancellationToken ct);
}
