using System.ComponentModel.DataAnnotations;
namespace ControleAtrasos.Api.DTO;
public sealed class IdentificarRequest
{
    [Required] public string Cpf { get; set; } = "";
}
public sealed class ConfirmarRequest
{
    [Required] public string TokenConfirmacao { get; set; } = "";
}
public sealed record IdentificarResponse(string Aluno, string Turma, string HorarioEntrada,
    int MinutosAtrasoEstimados, string TokenConfirmacao, DateTime ExpiraEm);
public sealed record ConfirmarResponse(int IdRegistro, DateTime DataHoraRegistro, int MinutosAtraso);
public sealed record AtrasoResponse(int IdRegistro, string Aluno, string Matricula, string Turma,
    DateTime DataHoraRegistro, string HorarioPrevisto, int MinutosAtraso);
