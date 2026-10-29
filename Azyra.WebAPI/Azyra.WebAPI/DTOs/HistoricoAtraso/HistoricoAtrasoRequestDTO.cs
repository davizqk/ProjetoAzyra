using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.HistoricoAtraso;

public class HistoricoAtrasoRequestDTO
{
    public int IdAluno { get; set; }
    public DateTime Data { get; set; }
    public bool Atrasado { get; set; }
    public int ConsecutivoAtual { get; set; }
}
