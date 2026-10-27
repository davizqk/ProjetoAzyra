using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class AlunoRepository : Repository<Aluno>, IAlunoRepository
{
    public AlunoRepository(AzyraContext context) : base(context) { }
}
