using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Route("api/registro")]
[AllowAnonymous]
[EnableRateLimiting("registro")]
public sealed class RegistroController(IRegistroService registro) : ControllerBase
{
    [HttpPost("identificar")]
    public async Task<ActionResult<IdentificarResponse>> Identificar([FromBody] IdentificarRequest req, CancellationToken ct) =>
        Ok(await registro.IdentificarAsync(req.Cpf, ct));

    [HttpPost("confirmar")]
    public async Task<ActionResult<ConfirmarResponse>> Confirmar([FromBody] ConfirmarRequest req, CancellationToken ct) =>
        Ok(await registro.ConfirmarAsync(req.TokenConfirmacao, ct));
}
