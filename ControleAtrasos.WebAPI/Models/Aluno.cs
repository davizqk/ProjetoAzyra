namespace ControleAtrasos.Api.Models;

public sealed class Aluno
{
    public int IdAluno {get;set;}
    public string Nome {get;set;} = "";
    public byte[] CPFHash {get;set;} = [];
    public string Matricula {get;set;} = "";
    public bool Ativo {get;set;} = true;
    public DateTime DataCadastro {get;set;}
}
