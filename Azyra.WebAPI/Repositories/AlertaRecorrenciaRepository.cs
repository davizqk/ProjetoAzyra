using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class AlertaRecorrenciaRepository : Repository<AlertaRecorrencia>, IAlertaRecorrenciaRepository
{
    public AlertaRecorrenciaRepository(AzyraContext context) : base(context) { }
}
