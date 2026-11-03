using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories;

public class QRCodeRepository : Repository<QRCode>, IQRCodeRepository
{
    public QRCodeRepository(AzyraContext context) : base(context) { }
}
