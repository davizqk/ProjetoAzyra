using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class PerfilAcessoRepository : Repository<PerfilAcesso>, IPerfilAcessoRepository
{
    public PerfilAcessoRepository(AzyraContext context) : base(context) { }
}
