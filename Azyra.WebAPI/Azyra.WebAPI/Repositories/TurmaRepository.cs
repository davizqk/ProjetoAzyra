using Azyra.WebAPI.Data;
using Azyra.WebAPI.Interfaces;
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Repositories
{
    public class TurmaRepository : ITurmaRepository
    {
        private readonly AzyraContext _context;

        public TurmaRepository(AzyraContext context)
        {
            _context = context;
        }

        public List<Turma> ListarTodas()
        {
            return _context.Turmas.ToList();
        }

        public Turma? BuscarPorId(int id)
        {
            return _context.Turmas.Find(id);
        }

        public void Cadastrar(Turma turma)
        {
            _context.Turmas.Add(turma);
            _context.SaveChanges();
        }

        public void Atualizar(Turma turma)
        {
            _context.Turmas.Update(turma);
            _context.SaveChanges();
        }

        public void Deletar(int id)
        {
            Turma? turma = _context.Turmas.Find(id);

            if (turma != null)
            {
                _context.Turmas.Remove(turma);
                _context.SaveChanges();
            }
        }
    }
}

