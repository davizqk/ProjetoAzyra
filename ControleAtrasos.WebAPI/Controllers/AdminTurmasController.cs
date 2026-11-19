using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ControleAtrasos.Api.Controllers;
[ApiController]
[Authorize(Policy = "Admin")]
[Route("api/admin")]
public sealed class AdminTurmasController(IAdministracaoService admin, ICadastroRepository dados) : ControllerBase
{
    [HttpGet("modelos")] public Task<IReadOnlyList<ModeloEnsino>> Modelos(CancellationToken ct) => dados.ModelosAsync(ct);
    [HttpGet("periodos")] public Task<IReadOnlyList<Periodo>> Periodos(CancellationToken ct) => dados.PeriodosAsync(ct);
    [HttpGet("turmas")] public Task<IReadOnlyList<Turma>> Turmas(CancellationToken ct) => dados.TurmasAsync(ct);
    [HttpPost("turmas")]
    public async Task<ActionResult<Turma>> CriarTurma([FromBody] CriarTurmaRequest req, CancellationToken ct)
    {
        var item = await admin.CriarTurmaAsync(req, ct);
        return Created($"/api/admin/turmas/{item.IdTurma}", item);
    }
    [HttpPut("turmas/{id:int}")]
    public async Task<ActionResult<Turma>> AtualizarTurma(int id, [FromBody] AtualizarTurmaRequest req, CancellationToken ct) =>
        Ok(await admin.AtualizarTurmaAsync(id, req, ct));
    [HttpGet("matriculas")] public Task<IReadOnlyList<Matricula>> Matriculas([FromQuery] int? turmaId, CancellationToken ct) =>
        dados.MatriculasAsync(turmaId, ct);
    [HttpPost("matriculas")]
    public async Task<ActionResult<Matricula>> CriarMatricula([FromBody] CriarMatriculaRequest req, CancellationToken ct)
    {
        var item = await admin.CriarMatriculaAsync(req, ct);
        return Created($"/api/admin/matriculas/{item.IdMatricula}", item);
    }
    [HttpPost("professor-turmas")]
    public async Task<ActionResult<ProfessorTurma>> VincularProfessor([FromBody] CriarProfessorTurmaRequest req, CancellationToken ct)
    {
        var item = await admin.VincularProfessorAsync(req, ct);
        return Created($"/api/admin/professor-turmas/{item.IdProfessorTurma}", item);
    }
    [HttpGet("horarios")] public Task<IReadOnlyList<HorarioTurma>> Horarios([FromQuery] int? turmaId, CancellationToken ct) =>
        dados.HorariosAsync(turmaId, ct);
    [HttpPost("horarios")]
    public async Task<ActionResult<HorarioTurma>> CriarHorario([FromBody] CriarHorarioRequest req, CancellationToken ct)
    {
        var item = await admin.CriarHorarioAsync(req, ct);
        return Created($"/api/admin/horarios/{item.IdHorario}", item);
    }
    [HttpPut("horarios/{id:int}")]
    public async Task<ActionResult<HorarioTurma>> AtualizarHorario(int id, [FromBody] AtualizarHorarioRequest req, CancellationToken ct) =>
        Ok(await admin.AtualizarHorarioAsync(id, req, ct));
    [HttpPost("calendario/gerar")]
    public async Task<ActionResult<object>> GerarCalendario(
        [FromBody] GerarCalendarioRequest req, CancellationToken ct)
    {
        var inseridos = await admin.GerarCalendarioPeriodoAsync(req, ct);
        return Ok(new { diasInseridos = inseridos });
    }

    [HttpGet("turmas/{idTurma:int}/excecoes-calendario")]
    public Task<IReadOnlyList<ExcecaoCalendarioTurma>> ExcecoesCalendario(
        int idTurma, [FromQuery] DateTime inicio, [FromQuery] DateTime fim, CancellationToken ct) =>
        admin.ExcecoesTurmaAsync(idTurma, inicio, fim, ct);

    [HttpPut("turmas/{idTurma:int}/excecoes-calendario/{data:datetime}")]
    public async Task<ActionResult<ExcecaoCalendarioTurma>> DefinirExcecao(
        int idTurma, DateTime data, [FromBody] ExcecaoCalendarioTurmaRequest req, CancellationToken ct) =>
        Ok(await admin.DefinirExcecaoTurmaAsync(idTurma, data, req, ct));

    [HttpDelete("turmas/{idTurma:int}/excecoes-calendario/{data:datetime}")]
    public async Task<IActionResult> ExcluirExcecao(int idTurma, DateTime data, CancellationToken ct)
    {
        await admin.ExcluirExcecaoTurmaAsync(idTurma, data, ct);
        return NoContent();
    }

    [HttpPut("calendario/{data:datetime}")]
    public async Task<IActionResult> AtualizarCalendario(DateTime data, [FromBody] CalendarioRequest req, CancellationToken ct)
    {
        await admin.AtualizarDiaLetivoAsync(data, req, ct);
        return NoContent();
    }
}
