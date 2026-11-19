using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Authorize(Policy = "Admin")]
[Route("api/admin/funcionarios")]
public sealed class AdminFuncionariosController(IAdministracaoService admin) : ControllerBase
{
    [HttpGet] public Task<IReadOnlyList<FuncionarioResponse>> Listar(CancellationToken ct) => admin.FuncionariosAsync(ct);
    [HttpPost]
    public async Task<ActionResult<FuncionarioResponse>> Criar([FromBody] CriarFuncionarioRequest req, CancellationToken ct)
    {
        var criado = await admin.CriarFuncionarioAsync(req, ct);
        return Created($"/api/admin/funcionarios/{criado.IdUsuario}", criado);
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult<FuncionarioResponse>> Atualizar(int id, [FromBody] AtualizarFuncionarioRequest req, CancellationToken ct) =>
        Ok(await admin.AtualizarFuncionarioAsync(id, req, ct));
}
