using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Aluno
{
    public int IdAluno { get; set; }

    public string Nome { get; set; } = null!;

    public string Matricula { get; set; } = null!;

    public string Turma { get; set; } = null!;

    public virtual ICollection<HistoricoAtraso> HistoricoAtrasos { get; set; } = new List<HistoricoAtraso>();
}
