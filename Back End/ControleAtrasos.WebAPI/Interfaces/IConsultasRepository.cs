using ControleAtrasos.Api.DTO;
namespace ControleAtrasos.Api.Interfaces;
public interface IConsultasRepository
{
    Task<IReadOnlyList<object>> TurmasDoProfessorAsync(int idUsuario, DateTime data, CancellationToken ct);
    Task<bool> PodeVerTurmaAsync(int idUsuario, int idTurma, DateTime data, bool gestao, CancellationToken ct);
    Task<PaginaResponse<AtrasoResponse>> AtrasosDaTurmaAsync(int idTurma, DateTime inicio, DateTime fimExclusivo, int pagina, int tamanho, CancellationToken ct);
    Task<PaginaResponse<AtrasoResponse>> AtrasosGestaoAsync(int? idTurma, DateTime inicio, DateTime fimExclusivo, int pagina, int tamanho, CancellationToken ct);
    Task<IndicadoresResponse> IndicadoresAsync(DateTime inicio, DateTime fimExclusivo, CancellationToken ct);
    Task<PaginaResponse<AlertaResponse>> AlertasAsync(string? status, int pagina, int tamanho, CancellationToken ct);
    Task<bool> AlterarAlertaAsync(int idAlerta, string status, string? observacao, CancellationToken ct);
}
