namespace ControleAtrasos.Api.Models;

public sealed class AlertaRecorrencia
{
    public int IdAlerta {get;set;}
    public int IdMatricula {get;set;}
    public int IdRegra {get;set;}
    public DateTime DataInicioSequencia {get;set;}
    public DateTime DataFimSequencia {get;set;}
    public DateTime DataIdentificacao {get;set;}
    public int QuantidadeAtrasos {get;set;}
    public string Status {get;set;} = "PENDENTE";
    public string? Observacao {get;set;}
}
