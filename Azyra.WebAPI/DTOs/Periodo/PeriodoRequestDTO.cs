using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.Periodo;

public class PeriodoRequestDTO
{
    [Required]
    public string Nome { get; set; } = string.Empty;
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFim { get; set; }
}
