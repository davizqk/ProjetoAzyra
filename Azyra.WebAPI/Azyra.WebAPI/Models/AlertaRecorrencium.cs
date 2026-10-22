using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class AlertaRecorrencium
{
    public int IdAlerta { get; set; }

    public int? IdAluno { get; set; }

    public DateTime GeradoEm { get; set; }

    public int QuantidadeDetectada { get; set; }

    public string Status { get; set; } = null!;

    public virtual Aluno? IdAlunoNavigation { get; set; }
}
