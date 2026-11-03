using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class HistoricoAtrasoRepository : Repository<HistoricoAtraso>, IHistoricoAtrasoRepository
{
    public HistoricoAtrasoRepository(AzyraContext context) : base(context) { }
}
