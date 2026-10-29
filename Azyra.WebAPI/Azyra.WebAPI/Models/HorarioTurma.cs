using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class HorarioTurma
{
    public int IdHorario { get; set; }

    public int DiaSemana { get; set; }

    public TimeOnly HoraEntrada { get; set; }

    public int ToleranciaMin { get; set; }

    public int IdTurma { get; set; }

    public virtual Turma IdTurmaNavigation { get; set; } = null!;
}
