using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class PerfilAcesso
{
    public int IdPerfil { get; set; }

    public string Nome { get; set; } = null!;

    public string? Permissoes { get; set; }
}
