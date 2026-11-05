using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricoAtrasosController : ControllerBase
    {
        private readonly AzyraProfessorContext _context;

        public HistoricoAtrasosController(AzyraProfessorContext context)
        {
            _context = context;
        }

        // GET: api/HistoricoAtrasos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoricoAtraso>>> GetHistoricos()
        {
            return await _context.HistoricoAtrasos
                .Include(h => h.IdAlunoNavigation)
                .ToListAsync();
        }

        // GET: api/HistoricoAtrasos/verificar-regras/{idAluno}/{tipoEscola}
        // tipoEscola: "comunidade" (limite 3) ou "seduc" (limite 2)
        [HttpGet("verificar-regras/{idAluno}/{tipoEscola}")]
        public async Task<IActionResult> VerificarRegraAtrasos(int idAluno, string tipoEscola)
        {
            var aluno = await _context.Alunos.FindAsync(idAluno);
            if (aluno == null)
            {
                return NotFound("Aluno não encontrado.");
            }

            // Buscar todos os atrasos do aluno ordenados do mais recente para o mais antigo
            var historicos = await _context.HistoricoAtrasos
                .Where(h => h.IdAluno == idAluno)
                .OrderByDescending(h => h.DataAtraso)
                .ToListAsync();

            int totalAtrasos = historicos.Count;

            // Definir limite com base no modelo da escola
            int limite = 0;
            string modelo = tipoEscola.ToLower();

            if (modelo == "comunidade")
            {
                limite = 3; // Regra Comunidade — 3 consecutivos/acumulados
            }
            else if (modelo == "seduc")
            {
                limite = 2; // Regra SEDUC — 2 consecutivos/acumulados
            }
            else
            {
                return BadRequest("Modelo de escola inválido. Utilize 'comunidade' ou 'seduc'.");
            }

            bool atingiuLimite = totalAtrasos >= limite;

            return Ok(new
            {
                Aluno = aluno.Nome,
                Matricula = aluno.Matricula,
                ModeloEscola = modelo.ToUpper(),
                TotalAtrasos = totalAtrasos,
                LimitePermitido = limite,
                AtingiuLimitePunicao = atingiuLimite,
                Status = atingiuLimite
                    ? $"ALERTA: O aluno atingiu ou ultrapassou o limite de {limite} atrasos permitidos pelo modelo {modelo.ToUpper()}!"
                    : "Aluno dentro do limite regulamentar."
            });
        }
    }
}