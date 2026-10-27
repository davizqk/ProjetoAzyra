namespace Azyra.WebAPI.DTOs.Turma;

public class TurmaResponseDTO
{
    public int IdTurma { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int AnoLetivo { get; set; }
    public int IdModelo { get; set; }
    public int IdPeriodo { get; set; }
}
