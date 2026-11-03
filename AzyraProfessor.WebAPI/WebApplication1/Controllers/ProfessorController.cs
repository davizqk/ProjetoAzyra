
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.DTOs.Professor;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessorController : ControllerBase
{
    private readonly AzyraProfessorContext _context;

    public ProfessorController(AzyraProfessorContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfessorResponseDTO>>> Get()
    {
        var professores = await _context.Professores
            .Select(p => new ProfessorResponseDTO
            {
                IdProfessor = p.IdProfessor,
                Nome = p.Nome,
                Cpf = p.Cpf
            })
            .ToListAsync();

        return Ok(professores);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProfessorResponseDTO>> GetById(int id)
    {
        var professor = await _context.Professores
            .Where(p => p.IdProfessor == id)
            .Select(p => new ProfessorResponseDTO
            {
                IdProfessor = p.IdProfessor,
                Nome = p.Nome,
                Cpf = p.Cpf
            })
            .FirstOrDefaultAsync();

        if (professor == null)
            return NotFound();

        return Ok(professor);
    }


    [HttpPost]
    public async Task<ActionResult<ProfessorResponseDTO>> Post(
        ProfessorRequestDTO dto)
    {
        var professor = new Professor
        {
            Nome = dto.Nome,
            Cpf = dto.Cpf,
            Senha = dto.Senha
        };

        _context.Professores.Add(professor);

        await _context.SaveChangesAsync();

        var response = new ProfessorResponseDTO
        {
            IdProfessor = professor.IdProfessor,
            Nome = professor.Nome,
            Cpf = professor.Cpf
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = professor.IdProfessor },
            response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(
        int id,
        ProfessorRequestDTO dto)
    {
        var professor = await _context.Professores
            .FindAsync(id);

        if (professor == null)
        {
            return NotFound("Professor não encontrado.");
        }

        professor.Nome = dto.Nome;
        professor.Cpf = dto.Cpf;
        professor.Senha = dto.Senha;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var professor = await _context.Professores
            .FindAsync(id);

        if (professor == null)
        {
            return NotFound("Professor não encontrado.");
        }

        _context.Professores.Remove(professor);

        await _context.SaveChangesAsync();

        return NoContent();
    }


}