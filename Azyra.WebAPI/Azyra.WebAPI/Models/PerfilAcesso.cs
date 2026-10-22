namespace Azyra.WebAPI.Models
{
    public class PerfilAcesso
    {
        public int IdPerfilAcesso { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Descricao { get; set; } = string.Empty;
        public object Permissoes { get; internal set; }
        public object? IdPerfil { get; internal set; }
    }
}