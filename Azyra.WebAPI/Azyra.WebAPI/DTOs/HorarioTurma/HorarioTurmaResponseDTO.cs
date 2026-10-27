namespace Azyra.WebAPI.DTOs.HorarioTurma;

public class HorarioTurmaResponseDTO
{
    public int IdHorario { get; set; }
    public int DiaSemana { get; set; }
    public TimeSpan HoraEntrada { get; set; }
    public int ToleranciaMin { get; set; }
    public int IdTurma { get; set; }
}
