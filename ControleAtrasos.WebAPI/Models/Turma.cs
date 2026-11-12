namespace ControleAtrasos.Api.Models;

public sealed class Turma
{
    public int IdTurma {get;set;}
    public string Nome {get;set;} = "";
    public int IdModelo {get;set;}
    public int IdPeriodo {get;set;}
    public int AnoLetivo {get;set;}
    public bool Ativa {get;set;} = true;
}
