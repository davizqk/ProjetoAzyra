namespace Azyra.WebAPI.Models;

public class AlertaRecorrencia
{
    public int IdAlerta { get; set; }
    public int IdAluno { get; set; }
    public DateTime GeradoEm { get; set; }
    public int QuantidadeDetectada { get; set; }
    public string Status { get; set; } = string.Empty;
}
