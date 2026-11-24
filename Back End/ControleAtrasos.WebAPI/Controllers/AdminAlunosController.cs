using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Authorize(Policy = "Admin")]
[Route("api/admin/alunos")]
public sealed class AdminAlunosController(IAdministracaoService admin) : ControllerBase
{
    [HttpGet] public Task<IReadOnlyList<AlunoResponse>> Listar(CancellationToken ct) => admin.AlunosAsync(ct);
    [HttpPost]
    public async Task<ActionResult<AlunoResponse>> Criar([FromBody] CriarAlunoRequest req, CancellationToken ct)
    {
        var criado = await admin.CriarAlunoAsync(req, ct);
        return Created($"/api/admin/alunos/{criado.IdAluno}", criado);
    }
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AlunoResponse>> Atualizar(int id, [FromBody] AtualizarAlunoRequest req, CancellationToken ct) =>
        Ok(await admin.AtualizarAlunoAsync(id, req, ct));
}
