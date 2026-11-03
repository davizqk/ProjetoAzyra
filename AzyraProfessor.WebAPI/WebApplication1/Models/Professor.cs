using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Professor
{
    public int IdProfessor { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;
}
