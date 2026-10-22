using Azyra.WebAPI.DTO;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeriodosController : ControllerBase
    {
        private readonly IPeriodoRepository _periodoRepository;

        public PeriodosController(IPeriodoRepository periodoRepository)
        {
            _periodoRepository = periodoRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PeriodoDTO>>> ObterTodos()
        {
            var periodos = await _periodoRepository.ObterTodosAsync();
            var result = periodos.Select(p => new PeriodoDTO
            {
                IdPeriodo = p.IdPeriodo,
                Nome = p.Nome,
                HoraInicio = p.HoraInicio,
                HoraFim = p.HoraFim
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PeriodoDTO>> ObterPorId(int id)
        {
            var p = await _periodoRepository.ObterPorIdAsync(id);
            if (p == null) return NotFound("Período não encontrado.");

            return Ok(new PeriodoDTO
            {
                IdPeriodo = p.IdPeriodo,
                Nome = p.Nome,
                HoraInicio = p.HoraInicio,
                HoraFim = p.HoraFim
            });
        }

        [HttpPost]
        public async Task<ActionResult<PeriodoDTO>> Criar([FromBody] CriarPeriodoDTO dto)
        {
            if (dto.HoraFim <= dto.HoraInicio)
            {
                return BadRequest("O horário final deve ser maior que o horário inicial.");
            }

            var novoPeriodo = new Periodo
            {
                Nome = dto.Nome,
                HoraInicio = dto.HoraInicio,
                HoraFim = dto.HoraFim
            };

            var criado = await _periodoRepository.CriarAsync(novoPeriodo);

            var result = new PeriodoDTO
            {
                IdPeriodo = criado.IdPeriodo,
                Nome = criado.Nome,
                HoraInicio = criado.HoraInicio,
                HoraFim = criado.HoraFim
            };

            return CreatedAtAction(nameof(ObterPorId), new { id = result.IdPeriodo }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] CriarPeriodoDTO dto)
        {
            var periodoExistente = await _periodoRepository.ObterPorIdAsync(id);
            if (periodoExistente == null) return NotFound("Período não encontrado.");

            if (dto.HoraFim <= dto.HoraInicio)
            {
                return BadRequest("O horário final deve ser maior que o horário inicial.");
            }

            periodoExistente.Nome = dto.Nome;
            periodoExistente.HoraInicio = dto.HoraInicio;
            periodoExistente.HoraFim = dto.HoraFim;

            await _periodoRepository.AtualizarAsync(periodoExistente);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var removido = await _periodoRepository.DeletarAsync(id);
            if (!removido) return NotFound("Período não encontrado ou com pendências de associação.");

            return NoContent();
        }
    }
}