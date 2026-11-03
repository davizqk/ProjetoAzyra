using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.AlertaRecorrencia;

public class AlertaRecorrenciaRequestDTO
{
    public int IdAluno { get; set; }
    public DateTime? GeradoEm { get; set; }
    public int QuantidadeDetectada { get; set; }
    public string? Status { get; set; }
}
