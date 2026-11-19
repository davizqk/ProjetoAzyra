namespace ControleAtrasos.Api.Models;

public sealed class Usuario
{
    public int IdUsuario {get;set;}
    public string Nome {get;set;} = "";
    public string Email {get;set;} = "";
    public string SenhaHash {get;set;} = "";
    public bool Ativo {get;set;} = true;
    public DateTime DataCriacao {get;set;}
}
