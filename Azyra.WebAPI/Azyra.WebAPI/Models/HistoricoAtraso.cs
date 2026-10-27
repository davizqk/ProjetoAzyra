using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class HistoricoAtraso
{
    public int IdHistorico { get; set; }

    public int IdAluno { get; set; }

    public DateOnly Data { get; set; }

    public bool Atrasado { get; set; }

    public int ConsecutivoAtual { get; set; }

    public virtual Aluno IdAlunoNavigation { get; set; } = null!;
}
