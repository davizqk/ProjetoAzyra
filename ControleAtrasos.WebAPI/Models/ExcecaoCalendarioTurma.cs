namespace ControleAtrasos.Api.Models;

/// <summary>Excecao de data especifica: aula extra ou cancelamento para uma turma.</summary>
public sealed class ExcecaoCalendarioTurma
{
    public int IdTurma { get; set; }
    public DateTime DataLetiva { get; set; }
    public bool TemAula { get; set; }
    public string? Motivo { get; set; }
}
