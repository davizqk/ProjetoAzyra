using System.Security.Claims;
using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Authorize(Policy = "ProfessorOuGestao")]
[Route("api/professor")]
public sealed class ProfessorController(IConsultasRepository consultas) : ControllerBase
{
    [HttpGet("turmas")]
    public async Task<IActionResult> Turmas(CancellationToken ct)
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await consultas.TurmasDoProfessorAsync(id, DateTime.Today, ct));
    }
}

[ApiController]
[Authorize(Policy = "ProfessorOuGestao")]
[Route("api/turmas")]
public sealed class TurmaAtrasosController(IConsultasRepository consultas) : ControllerBase
{
    [HttpGet("{id:int}/atrasos")]
    public async Task<ActionResult<PaginaResponse<AtrasoResponse>>> Atrasos(int id,
        [FromQuery] DateTime? inicio, [FromQuery] DateTime? fim,
        [FromQuery] int pagina = 1, [FromQuery] int tamanho = 50, CancellationToken ct = default)
    {
        if (pagina < 1 || tamanho is < 1 or > 100) return BadRequest("Página/tamanho inválidos.");
        var desde = (inicio ?? DateTime.Today.AddDays(-30)).Date;
        var ate = (fim ?? DateTime.Today).Date.AddDays(1);
        if (ate <= desde || (ate-desde).TotalDays > 366) return BadRequest("Intervalo inválido (máx. 366 dias).");
        var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var gestao = User.IsInRole("AQV") || User.IsInRole("COORDENACAO") || User.IsInRole("ADMIN");
        if (!await consultas.PodeVerTurmaAsync(idUsuario, id, DateTime.Today, gestao, ct)) return Forbid();
        return Ok(await consultas.AtrasosDaTurmaAsync(id, desde, ate, pagina, tamanho, ct));
    }
}
