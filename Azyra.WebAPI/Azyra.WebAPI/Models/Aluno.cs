using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class Aluno
{
    public int IdAluno { get; set; }

    public string Nome { get; set; } = null!;

    public string Matricula { get; set; } = null!;

    public int IdTurma { get; set; }

    public virtual ICollection<AlertaRecorrencium> AlertaRecorrencia { get; set; } = new List<AlertaRecorrencium>();

    public virtual ICollection<HistoricoAtraso> HistoricoAtrasos { get; set; } = new List<HistoricoAtraso>();

    public virtual Turma IdTurmaNavigation { get; set; } = null!;
}
