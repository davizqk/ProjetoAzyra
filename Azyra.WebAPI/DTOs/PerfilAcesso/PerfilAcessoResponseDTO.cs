namespace Azyra.WebAPI.DTOs.PerfilAcesso;

public class PerfilAcessoResponseDTO
{
    public int IdPerfil { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Permissoes { get; set; }
}
