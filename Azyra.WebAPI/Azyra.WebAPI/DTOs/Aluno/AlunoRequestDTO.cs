using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.Aluno;

public class AlunoRequestDTO
{
    [Required]
    public string Nome { get; set; } = string.Empty;
    [Required]
    public string Matricula { get; set; } = string.Empty;
    public int IdTurma { get; set; }
}
