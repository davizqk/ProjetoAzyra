using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.ModeloEnsino;

public class ModeloEnsinoRequestDTO
{
    [Required]
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
}
