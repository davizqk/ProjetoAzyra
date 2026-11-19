namespace ControleAtrasos.Api.Models;

public sealed class Matricula
{
    public int IdMatricula {get;set;}
    public int IdAluno {get;set;}
    public int IdTurma {get;set;}
    public DateTime DataMatricula {get;set;}
    public DateTime? DataSaida {get;set;}
}
