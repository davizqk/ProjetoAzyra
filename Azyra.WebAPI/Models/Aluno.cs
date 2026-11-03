namespace Azyra.WebAPI.Models;

public class Aluno
{
    public int IdAluno { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? CPF { get; set; }
    public int IdTurma { get; set; }
}
