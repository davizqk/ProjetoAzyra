using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Interfaces
{
    public interface IPerfilAcessoRepository
    {
        Task<List<PerfilAcesso>> ListarTodos();

        Task<PerfilAcesso?> BuscarPorId(int id);

        Task<PerfilAcesso> Adicionar(PerfilAcesso perfil);

        Task<bool> Atualizar(PerfilAcesso perfil);

        Task<bool> Excluir(int id);
    }
}
