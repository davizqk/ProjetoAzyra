namespace Azyra.WebAPI.DTOs.HistoricoAtraso;

public class HistoricoAtrasoResponseDTO
{
    public int IdHistorico { get; set; }
    public int IdAluno { get; set; }
    public string NomeAluno { get; set; } = string.Empty;
    public string NomeTurma { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public TimeSpan HoraChegada { get; set; }
    public bool Atrasado { get; set; }
    public int ConsecutivoAtual { get; set; }
}
