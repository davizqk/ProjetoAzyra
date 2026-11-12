using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;

namespace ControleAtrasos.Api.Services;
public sealed class RecorrenciaService(IRecorrenciaRepository repositorio) : IRecorrenciaService
{
    public async Task VerificarAsync(int idMatricula, DateTime data, CancellationToken ct)
    {
        var modelo = await repositorio.ModeloDaMatriculaAsync(idMatricula, ct);
        if (modelo is null) return;
        var regras = await repositorio.RegrasAsync(modelo.Value, ct);
        foreach (var regra in regras)
        {
            // O DDL define recorrencia de dias letivos consecutivos.
            if (regra.TipoContagem != "DIAS_LETIVOS_CONSECUTIVOS" ||
                !regra.ConsiderarDiasLetivos || regra.QuantidadeConsecutiva is < 2 or > 365)
                continue;
            var dias = await repositorio.UltimosDiasLetivosAsync(data.Date, regra.QuantidadeConsecutiva, ct);
            if (dias.Count != regra.QuantidadeConsecutiva || dias[0].Date != data.Date) continue;
            var atrasos = await repositorio.DatasComAtrasoAsync(idMatricula, dias[^1].Date, data.Date.AddDays(1), ct);
            if (dias.Any(d => !atrasos.Any(a => a.Date == d.Date))) continue;
            if (await repositorio.ExisteAlertaAsync(idMatricula, regra.IdRegra, data.Date, ct)) continue;
            repositorio.AdicionarAlerta(new AlertaRecorrencia {
                IdMatricula = idMatricula, IdRegra = regra.IdRegra,
                DataInicioSequencia = dias[^1].Date, DataFimSequencia = data.Date,
                DataIdentificacao = DateTime.Now, QuantidadeAtrasos = regra.QuantidadeConsecutiva,
                Status = "PENDENTE"
            });
        }
        // A persistencia ocorre junto ao registro, na mesma transacao do servico principal.
    }
}
