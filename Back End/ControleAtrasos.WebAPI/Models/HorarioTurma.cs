namespace ControleAtrasos.Api.Models;

public sealed class HorarioTurma
{
    public int IdHorario {get;set;}
    public int IdTurma {get;set;}
    public int DiaSemana {get;set;}
    public TimeSpan HorarioEntrada {get;set;}
    public int ToleranciaMinutos {get;set;}
    public DateTime VigenciaInicio {get;set;}
    public DateTime? VigenciaFim {get;set;}
    public bool Ativo {get;set;} = true;
}
