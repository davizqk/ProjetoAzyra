using System;
using System.Collections.Generic;

namespace Azyra.WebAPI.Models;

public partial class QRCode
{
    public int IdQr { get; set; }

    public int IdTurma { get; set; }

    public string TokenHash { get; set; } = null!;

    public DateTime GeradoEm { get; set; }

    public DateTime ExpiraEm { get; set; }

    public bool Ativo { get; set; }

    public virtual Turma IdTurmaNavigation { get; set; } = null!;
}
