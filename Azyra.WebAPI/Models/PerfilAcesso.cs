namespace Azyra.WebAPI.Models;

public class PerfilAcesso
{
    public int IdPerfil { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Permissoes { get; set; }
}
