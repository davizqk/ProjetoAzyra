using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace Azyra.WebAPI.Repositories
{
    public class PerfilAcessoRepository : IPerfilAcessoRepository
    {
        private readonly AzyraContext _context;

        public PerfilAcessoRepository(AzyraContext context)
        {
            _context = context;
        }

        public async Task<List<PerfilAcesso>> ListarTodos()
        {
            return await _context.PerfilAcessos
                .ToListAsync();
        }

        public async Task<PerfilAcesso?> BuscarPorId(int id)
        {
            return await _context.PerfilAcessos
                .FindAsync(id);
        }

        public async Task<PerfilAcesso> Adicionar(PerfilAcesso perfil)
        {
            _context.PerfilAcessos.Add(perfil);

            await _context.SaveChangesAsync();

            return perfil;
        }

        public async Task<bool> Atualizar(PerfilAcesso perfil)
        {
            var existente = await _context.PerfilAcessos
                .FindAsync(perfil.IdPerfilAcesso);

            if (existente == null)
                return false;

            existente.Nome = perfil.Nome;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Excluir(int id)
        {
            var perfil = await _context.PerfilAcessos.FindAsync(id);

            if (perfil == null)
                return false;

            _context.PerfilAcessos.Remove(perfil);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
