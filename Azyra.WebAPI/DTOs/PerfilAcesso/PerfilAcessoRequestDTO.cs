using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.PerfilAcesso;

public class PerfilAcessoRequestDTO
{
    [Required]
    public string Nome { get; set; } = string.Empty;
    public string? Permissoes { get; set; }
}
