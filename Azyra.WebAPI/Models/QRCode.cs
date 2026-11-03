namespace Azyra.WebAPI.Models;

public class QRCode
{
    public int IdQR { get; set; }
    public int IdTurma { get; set; }
    public string TokenHash { get; set; } = string.Empty;
    public DateTime GeradoEm { get; set; }
    public DateTime ExpiraEm { get; set; }
    public bool Ativo { get; set; }
}
