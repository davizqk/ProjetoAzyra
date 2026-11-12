namespace ControleAtrasos.Api.Models;

public sealed class ProfessorTurma
{
    public int IdProfessorTurma {get;set;}
    public int IdFuncionario {get;set;}
    public int IdTurma {get;set;}
    public DateTime DataInicio {get;set;}
    public DateTime? DataFim {get;set;}
}
