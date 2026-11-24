namespace ControleAtrasos.Api.Models;

public sealed class RegraRecorrencia
{
    public int IdRegra {get;set;}
    public int IdModelo {get;set;}
    public string TipoContagem {get;set;} = "";
    public int QuantidadeConsecutiva {get;set;}
    public bool ConsiderarDiasLetivos {get;set;} = true;
    public bool Ativa {get;set;} = true;
}
