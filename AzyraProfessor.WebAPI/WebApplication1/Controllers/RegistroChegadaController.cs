using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroChegadaController : ControllerBase
    {
        private readonly AzyraProfessorContext _context;

        public RegistroChegadaController(AzyraProfessorContext context)
        {
            _context = context;
        }

        // GET: api/RegistroChegada
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegistroChegada>>> GetRegistros()
        {
            return await _context.RegistroChegadas
                .Include(r => r.Aluno)
                .ToListAsync();
        }

        // POST: api/RegistroChegada
        [HttpPost]
        public async Task<ActionResult<RegistroChegada>> PostRegistroChegada([FromBody] int idAluno)
        {
            // 1. Validar se o aluno existe
            var aluno = await _context.Alunos.FindAsync(idAluno);
            if (aluno == null)
            {
                return NotFound("Aluno não encontrado.");
            }

            // 2. Impedir registo duplicado no mesmo dia
            var hoje = DateTime.Today;
            var jaRegistradoHoje = await _context.RegistroChegadas
                .AnyAsync(r => r.IdAluno == idAluno && r.DataHoraChegada.Date == hoje);

            if (jaRegistradoHoje)
            {
                return BadRequest("O aluno já possui um registo de chegada para hoje.");
            }

            // 3. Capturar horário real e calcular atraso a partir das 08:00
            var agora = DateTime.Now;
            var horarioLimite = new TimeSpan(8, 0, 0); // 08:00:00

            bool estaAtrasado = agora.TimeOfDay > horarioLimite;
            int minutosAtraso = 0;

            if (estaAtrasado)
            {
                minutosAtraso = (int)(agora.TimeOfDay - horarioLimite).TotalMinutes;
            }

            var novoRegistro = new RegistroChegada
            {
                IdAluno = idAluno,
                DataHoraChegada = agora,
                EstaAtrasado = estaAtrasado,
                MinutosAtraso = minutosAtraso
            };

            _context.RegistroChegadas.Add(novoRegistro);

            // 4. Se estiver atrasado, alimenta automaticamente a tabela HistoricoAtraso
            if (estaAtrasado)
            {
                var historico = new HistoricoAtraso
                {
                    IdAluno = idAluno,
                    DataAtraso = agora,
                    MinutosAtraso = minutosAtraso,
                    Justificativa = "Atraso registado automaticamente por chegada após as 08:00."
                };
                _context.HistoricoAtrasos.Add(historico);
            }

            await _context.SaveChangesAsync();

            return Ok(novoRegistro);
        }
    }
}