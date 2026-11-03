using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class HorarioTurmaRepository : Repository<HorarioTurma>, IHorarioTurmaRepository
{
    public HorarioTurmaRepository(AzyraContext context) : base(context) { }
}
