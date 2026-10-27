using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class Turma
{
    public int IdTurma { get; set; }

    public string Nome { get; set; } = null!;

    public int AnoLetivo { get; set; }

    public int IdModelo { get; set; }

    public int IdPeriodo { get; set; }

    public virtual ICollection<Aluno> Alunos { get; set; } = new List<Aluno>();

    public virtual ICollection<HorarioTurma> HorarioTurmas { get; set; } = new List<HorarioTurma>();

    public virtual ModeloEnsino IdModeloNavigation { get; set; } = null!;

    public virtual Periodo IdPeriodoNavigation { get; set; } = null!;

    public virtual ICollection<QRCode> Qrcodes { get; set; } = new List<QRCode>();
}
