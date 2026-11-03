namespace Azyra.WebAPI.Models;

public class Periodo
{
    public int IdPeriodo { get; set; }
    public string Nome { get; set; } = string.Empty;
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFim { get; set; }
}
