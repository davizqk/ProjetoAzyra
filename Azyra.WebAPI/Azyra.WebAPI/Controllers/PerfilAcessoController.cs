
using Azyra.WebAPI.DTO;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace Azyra.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerfilAcessoController : ControllerBase
    {
        private readonly IPerfilAcessoRepository _repository;

        public PerfilAcessoController(
            IPerfilAcessoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var perfis = await _repository.ListarTodos();
            return Ok(perfis);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var perfil = await _repository.BuscarPorId(id);

            if (perfil == null)
                return NotFound("Perfil não encontrado.");

            return Ok(perfil);
        }

        [HttpPost]
        public async Task<IActionResult> Adicionar(
            [FromBody] PerfilAcessoDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("O nome é obrigatório.");

            var perfil = new PerfilAcesso
            {
                Nome = dto.Nome
            };

            var novoPerfil = await _repository.Adicionar(perfil);

            return Ok(novoPerfil);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(
            int id,
            [FromBody] PerfilAcessoDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("O nome é obrigatório.");

            var perfil = new PerfilAcesso
            {
                IdPerfilAcesso = id,
                Nome = dto.Nome
            };

            var atualizado = await _repository.Atualizar(perfil);

            if (!atualizado)
                return NotFound("Perfil não encontrado.");

            return Ok("Perfil atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var excluido = await _repository.Excluir(id);

            if (!excluido)
                return NotFound("Perfil não encontrado.");

            return Ok("Perfil excluído com sucesso.");
        }
    }
}
