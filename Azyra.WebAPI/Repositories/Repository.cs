using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Azyra.WebAPI.Repositories;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    private readonly AzyraContext _context;
    public Repository(AzyraContext context) => _context = context;

    public async Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Set<TEntity>().AsNoTracking().ToListAsync(cancellationToken);

    public async Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<TEntity>().FindAsync(new object?[] { id }, cancellationToken);
    }

    public async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _context.Set<TEntity>().AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<bool> UpdateAsync(int id, TEntity entity, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Set<TEntity>().FindAsync(new object?[] { id }, cancellationToken);
        if (existing is null) return false;
        _context.Entry(existing).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Set<TEntity>().FindAsync(new object?[] { id }, cancellationToken);
        if (existing is null) return false;
        _context.Set<TEntity>().Remove(existing);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

