using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class PeriodoRepository : Repository<Periodo>, IPeriodoRepository
{
    public PeriodoRepository(AzyraContext context) : base(context) { }
}
