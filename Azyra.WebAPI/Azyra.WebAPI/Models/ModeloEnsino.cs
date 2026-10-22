using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class ModeloEnsino
{
    public int IdModelo { get; set; }

    public string Nome { get; set; } = null!;

    public string? Descricao { get; set; }

    public virtual ICollection<Turma> Turmas { get; set; } = new List<Turma>();
}
