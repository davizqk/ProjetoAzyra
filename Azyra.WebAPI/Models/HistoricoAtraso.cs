namespace Azyra.WebAPI.Models;

public class HistoricoAtraso
{
    public int IdHistorico { get; set; }
    public int IdAluno { get; set; }
    public DateTime Data { get; set; }
    public TimeSpan HoraChegada { get; set; }
    public bool Atrasado { get; set; }
    public int ConsecutivoAtual { get; set; }
}
