namespace ControleAtrasos.Api.Models;

public sealed class RegistroAtraso
{
    public int IdRegistro {get;set;}
    public int IdMatricula {get;set;}
    public int IdHorario {get;set;}
    public DateTime DataHoraRegistro {get;set;}
    public DateTime DataAtraso {get;private set;}
    public TimeSpan HorarioPrevisto {get;set;}
    public int MinutosAtraso {get;set;}
}
