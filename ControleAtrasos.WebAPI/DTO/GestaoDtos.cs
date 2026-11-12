using System.ComponentModel.DataAnnotations;
namespace ControleAtrasos.Api.DTO;
public sealed record IndicadoresResponse(int TotalAtrasos, int MatriculasDistintas, double MediaMinutosAtraso);
public sealed record AlertaResponse(int IdAlerta, int IdMatricula, string Aluno, string Turma,
    int QuantidadeAtrasos, DateTime DataInicioSequencia, DateTime DataFimSequencia,
    DateTime DataIdentificacao, string Status, string? Observacao);
public sealed class AlterarAlertaRequest
{
    [Required] public string Status { get; set; } = "";
    [MaxLength(1000)] public string? Observacao { get; set; }
}
public sealed record PaginaResponse<T>(IReadOnlyList<T> Itens, int Pagina, int Tamanho, int Total);
