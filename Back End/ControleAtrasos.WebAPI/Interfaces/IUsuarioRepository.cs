using ControleAtrasos.Api.Models;
namespace ControleAtrasos.Api.Interfaces;
public interface IUsuarioRepository
{
    Task<Usuario?> BuscarPorEmailAsync(string email, CancellationToken ct);
    Task<IReadOnlyList<string>> PapeisAsync(int idUsuario, CancellationToken ct);
    Task<bool> EmailExisteAsync(string email, CancellationToken ct);
    Task<FuncionarioResponseInterno> CriarFuncionarioAsync(Usuario usuario, string? codigo, IReadOnlyList<string> papeis, CancellationToken ct);
    Task<IReadOnlyList<FuncionarioResponseInterno>> ListarFuncionariosAsync(CancellationToken ct);
    Task<FuncionarioResponseInterno?> AtualizarFuncionarioAsync(int idUsuario, string nome, bool ativo, IReadOnlyList<string> papeis, CancellationToken ct);
}
public sealed record FuncionarioResponseInterno(int IdUsuario, int IdFuncionario, string Nome,
    string Email, bool Ativo, string[] Papeis);
