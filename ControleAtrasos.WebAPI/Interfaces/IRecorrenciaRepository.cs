using ControleAtrasos.Api.Models;
namespace ControleAtrasos.Api.Interfaces;
public interface IRecorrenciaRepository
{
    Task<int?> ModeloDaMatriculaAsync(int idMatricula, CancellationToken ct);
    Task<IReadOnlyList<RegraRecorrencia>> RegrasAsync(int idModelo, CancellationToken ct);
    Task<IReadOnlyList<DateTime>> UltimosDiasLetivosAsync(DateTime data, int quantidade, CancellationToken ct);
    Task<IReadOnlyList<DateTime>> DatasComAtrasoAsync(int idMatricula, DateTime inicio, DateTime fimExclusivo, CancellationToken ct);
    Task<bool> ExisteAlertaAsync(int idMatricula, int idRegra, DateTime dataFinal, CancellationToken ct);
    void AdicionarAlerta(AlertaRecorrencia alerta);
}
