namespace ControleAtrasos.Api.Models;

public sealed class SolicitacaoRegistro
{
    public int IdSolicitacao {get;set;}
    public byte[] TokenHash {get;set;} = [];
    public int IdMatricula {get;set;}
    public int IdHorario {get;set;}
    public DateTime DataSolicitacao {get;set;}
    public DateTime DataExpiracao {get;set;}
    public DateTime? DataConfirmacao {get;set;}
}
