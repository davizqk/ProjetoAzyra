using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.Aluno;

public class AlunoRequestDTO
{
    [Required]
    public string Nome { get; set; } = string.Empty;
    public string? CPF { get; set; }
    public int IdTurma { get; set; }
}
