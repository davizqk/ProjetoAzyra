using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class ModeloEnsinoRepository : Repository<ModeloEnsino>, IModeloEnsinoRepository
{
    public ModeloEnsinoRepository(AzyraContext context) : base(context) { }
}
