using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.HorarioTurma;

public class HorarioTurmaRequestDTO
{
    public int DiaSemana { get; set; }
    public TimeSpan HoraEntrada { get; set; }
    public int ToleranciaMin { get; set; }
    public int IdTurma { get; set; }
}
