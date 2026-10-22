using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Interfaces
{
    public interface IPeriodoRepository
    {
        Task<IEnumerable<Periodo>> ObterTodosAsync();
        Task<Periodo?> ObterPorIdAsync(int id);
        Task<Periodo> CriarAsync(Periodo periodo);
        Task<bool> AtualizarAsync(Periodo periodo);
        Task<bool> DeletarAsync(int id);
    }
}