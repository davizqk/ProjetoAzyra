using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class HistoricoAtraso
{
    public int IdHistorico { get; set; }

    public int IdAluno { get; set; }

    public DateTime DataAtraso { get; set; }

    public int MinutosAtraso { get; set; }

    public string? Justificativa { get; set; }

    public virtual Aluno IdAlunoNavigation { get; set; } = null!;
}
