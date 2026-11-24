using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Authorize(Policy = "Gestao")]
[Route("api/gestao")]
public sealed class GestaoController(IConsultasRepository consultas) : ControllerBase
{
    private static (DateTime inicio, DateTime fim)? Intervalo(DateTime? inicio, DateTime? fim)
    {
        var desde = (inicio ?? DateTime.Today.AddDays(-30)).Date;
        var ate = (fim ?? DateTime.Today).Date.AddDays(1);
        if (ate <= desde || (ate-desde).TotalDays > 366) return null;
        return (desde, ate);
    }
    [HttpGet("atrasos")]
    public async Task<IActionResult> Atrasos([FromQuery] int? turmaId, [FromQuery] DateTime? inicio,
        [FromQuery] DateTime? fim, [FromQuery] int pagina = 1, [FromQuery] int tamanho = 50,
        CancellationToken ct = default)
    {
        var periodo = Intervalo(inicio, fim);
        if (periodo == null || pagina < 1 || tamanho is < 1 or > 100) return BadRequest("Filtro inválido.");
        return Ok(await consultas.AtrasosGestaoAsync(turmaId, periodo.Value.inicio, periodo.Value.fim, pagina, tamanho, ct));
    }
    [HttpGet("indicadores")]
    public async Task<IActionResult> Indicadores([FromQuery] DateTime? inicio, [FromQuery] DateTime? fim,
        CancellationToken ct)
    {
        var periodo = Intervalo(inicio, fim);
        if (periodo == null) return BadRequest("Intervalo inválido.");
        return Ok(await consultas.IndicadoresAsync(periodo.Value.inicio, periodo.Value.fim, ct));
    }
    [HttpGet("alertas")]
    public async Task<IActionResult> Alertas([FromQuery] string? status,
        [FromQuery] int pagina = 1, [FromQuery] int tamanho = 50, CancellationToken ct = default)
    {
        if (pagina < 1 || tamanho is < 1 or > 100) return BadRequest("Página/tamanho inválidos.");
        var filtro = status?.Trim().ToUpperInvariant();
        if (!string.IsNullOrEmpty(filtro) && filtro is not ("PENDENTE" or "VISUALIZADO" or "ENCERRADO"))
            return BadRequest("Status inválido.");
        return Ok(await consultas.AlertasAsync(string.IsNullOrWhiteSpace(filtro) ? null : filtro, pagina, tamanho, ct));
    }
    [HttpPatch("alertas/{id:int}")]
    public async Task<IActionResult> AtualizarAlerta(int id, [FromBody] AlterarAlertaRequest req, CancellationToken ct)
    {
        var status = req.Status.Trim().ToUpperInvariant();
        if (status is not ("PENDENTE" or "VISUALIZADO" or "ENCERRADO")) return BadRequest("Status inválido.");
        if (!await consultas.AlterarAlertaAsync(id, status, req.Observacao?.Trim(), ct)) return NotFound();
        return NoContent();
    }
}
