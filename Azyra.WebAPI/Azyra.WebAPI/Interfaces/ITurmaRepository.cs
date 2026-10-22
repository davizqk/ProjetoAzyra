
using Azyra.WebAPI.Models;

namespace Azyra.WebAPI.Interfaces
{
    public interface ITurmaRepository
    {
        List<Turma> ListarTodas();
        Turma? BuscarPorId(int id);
        void Cadastrar(Turma turma);
        void Atualizar(Turma turma);
        void Deletar(int id);
    }
}

