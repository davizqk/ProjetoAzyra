namespace Azyra.WebAPI.DTOs.Aluno;

public class AlunoResponseDTO
{
    public int IdAluno { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public int IdTurma { get; set; }
}
