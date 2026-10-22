using Azyra.WebAPI.Data; // Ajuste conforme o namespace do seu DbContext
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Repositories
{
    public class PeriodoRepository : IPeriodoRepository
    {
        private readonly AzyraContext _context;

        public PeriodoRepository(AzyraContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Periodo>> ObterTodosAsync()
        {
            return await _context.Set<Periodo>().ToListAsync();
        }

        public async Task<Periodo?> ObterPorIdAsync(int id)
        {
            return await _context.Set<Periodo>().FindAsync(id);
        }

        public async Task<Periodo> CriarAsync(Periodo periodo)
        {
            _context.Set<Periodo>().Add(periodo);
            await _context.SaveChangesAsync();
            return periodo;
        }

        public async Task<bool> AtualizarAsync(Periodo periodo)
        {
            _context.Set<Periodo>().Update(periodo);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var periodo = await ObterPorIdAsync(id);
            if (periodo == null) return false;

            _context.Set<Periodo>().Remove(periodo);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}