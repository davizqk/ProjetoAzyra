using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class Periodo
{
    public int IdPeriodo { get; set; }

    public string Nome { get; set; } = null!;

    public TimeOnly HoraInicio { get; set; }

    public TimeOnly HoraFim { get; set; }

    public virtual ICollection<Turma> Turmas { get; set; } = new List<Turma>();
}
