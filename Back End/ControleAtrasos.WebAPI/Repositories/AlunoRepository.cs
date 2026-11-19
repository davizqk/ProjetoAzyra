using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class AlunoRepository(AppDbContext db) : IAlunoRepository
{
    public Task<Aluno?> PorCpfHashAsync(byte[] hash, CancellationToken ct) =>
        db.Alunos.AsNoTracking().FirstOrDefaultAsync(x => x.CPFHash == hash && x.Ativo, ct);

    public Task<MatriculaAtiva?> MatriculaAtivaAsync(int idAluno, DateTime data, CancellationToken ct) =>
        (from m in db.Matriculas join t in db.Turmas on m.IdTurma equals t.IdTurma
         where m.IdAluno == idAluno && t.Ativa && m.DataMatricula <= data &&
               (m.DataSaida == null || m.DataSaida >= data)
         orderby m.DataMatricula descending
         select new MatriculaAtiva(m.IdMatricula, t.IdTurma, t.Nome, t.IdModelo)).FirstOrDefaultAsync(ct);

    public Task<Aluno?> PorIdAsync(int id, CancellationToken ct) => db.Alunos.FirstOrDefaultAsync(x => x.IdAluno == id, ct);
    public Task<bool> CpfOuMatriculaExisteAsync(byte[] hash, string numeroMatricula, CancellationToken ct) =>
        db.Alunos.AnyAsync(x => x.CPFHash == hash || x.Matricula == numeroMatricula, ct);
    public async Task<Aluno> CriarAsync(Aluno aluno, CancellationToken ct)
    {
        db.Alunos.Add(aluno);
        await db.SaveChangesAsync(ct);
        return aluno;
    }
    public Task SalvarAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
    public async Task<IReadOnlyList<Aluno>> ListarAsync(CancellationToken ct) =>
        await db.Alunos.AsNoTracking().OrderBy(x => x.Nome).Take(1000).ToListAsync(ct);
}
