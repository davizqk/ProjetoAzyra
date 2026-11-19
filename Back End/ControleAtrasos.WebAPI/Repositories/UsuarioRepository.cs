using ControleAtrasos.Api.Data;
using ControleAtrasos.Api.Interfaces;
using ControleAtrasos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleAtrasos.Api.Repositories;
public sealed class UsuarioRepository(AppDbContext db) : IUsuarioRepository
{
    public Task<Usuario?> BuscarPorEmailAsync(string email, CancellationToken ct) =>
        db.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, ct);

    public async Task<IReadOnlyList<string>> PapeisAsync(int idUsuario, CancellationToken ct) =>
        await (from up in db.UsuarioPapeis
               join p in db.Papeis on up.IdPapel equals p.IdPapel
               where up.IdUsuario == idUsuario select p.Nome).ToListAsync(ct);

    public Task<bool> EmailExisteAsync(string email, CancellationToken ct) => db.Usuarios.AnyAsync(x => x.Email == email, ct);

    public async Task<FuncionarioResponseInterno> CriarFuncionarioAsync(Usuario user, string? codigo, IReadOnlyList<string> papeis, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var entidades = await db.Papeis.Where(p => papeis.Contains(p.Nome)).ToListAsync(ct);
        if (entidades.Count != papeis.Count) throw new InvalidOperationException("Papéis não cadastrados.");
        db.Usuarios.Add(user);
        await db.SaveChangesAsync(ct);
        var funcionario = new Funcionario { IdUsuario = user.IdUsuario, CodigoFuncionario = codigo };
        db.Funcionarios.Add(funcionario);
        db.UsuarioPapeis.AddRange(entidades.Select(p => new UsuarioPapel { IdUsuario = user.IdUsuario, IdPapel = p.IdPapel }));
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return new(user.IdUsuario, funcionario.IdFuncionario, user.Nome, user.Email, user.Ativo, papeis.ToArray());
    }

    public async Task<IReadOnlyList<FuncionarioResponseInterno>> ListarFuncionariosAsync(CancellationToken ct)
    {
        var dados = await (from f in db.Funcionarios join u in db.Usuarios on f.IdUsuario equals u.IdUsuario
                           select new { u.IdUsuario, f.IdFuncionario, u.Nome, u.Email, u.Ativo }).ToListAsync(ct);
        var userIds = dados.Select(x => x.IdUsuario).ToArray();
        var papeis = await (from up in db.UsuarioPapeis join p in db.Papeis on up.IdPapel equals p.IdPapel
                            where userIds.Contains(up.IdUsuario)
                            select new { up.IdUsuario, p.Nome }).ToListAsync(ct);
        return dados.Select(d => new FuncionarioResponseInterno(d.IdUsuario, d.IdFuncionario, d.Nome, d.Email,
            d.Ativo, papeis.Where(p => p.IdUsuario == d.IdUsuario).Select(p => p.Nome).ToArray())).ToArray();
    }

    public async Task<FuncionarioResponseInterno?> AtualizarFuncionarioAsync(int idUsuario, string nome, bool ativo,
        IReadOnlyList<string> papeis, CancellationToken ct)
    {
        var user = await db.Usuarios.FirstOrDefaultAsync(x => x.IdUsuario == idUsuario, ct);
        var funcionario = await db.Funcionarios.FirstOrDefaultAsync(x => x.IdUsuario == idUsuario, ct);
        if (user == null || funcionario == null) return null;
        var roles = await db.Papeis.Where(x => papeis.Contains(x.Nome)).ToListAsync(ct);
        if (roles.Count != papeis.Count) throw new InvalidOperationException("Papéis não cadastrados.");
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        user.Nome = nome;
        user.Ativo = ativo;
        var previos = await db.UsuarioPapeis.Where(x => x.IdUsuario == idUsuario).ToListAsync(ct);
        db.UsuarioPapeis.RemoveRange(previos);
        db.UsuarioPapeis.AddRange(roles.Select(p => new UsuarioPapel { IdUsuario = idUsuario, IdPapel = p.IdPapel }));
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return new(idUsuario, funcionario.IdFuncionario, nome, user.Email, ativo, papeis.ToArray());
    }
}
