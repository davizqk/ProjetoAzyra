namespace Azyra.WebAPI.DTOs.HistoricoAtraso;

public class HistoricoAtrasoResponseDTO
{
    public int IdHistorico { get; set; }
    public int IdAluno { get; set; }
    public DateTime Data { get; set; }
    public bool Atrasado { get; set; }
    public int ConsecutivoAtual { get; set; }
}
