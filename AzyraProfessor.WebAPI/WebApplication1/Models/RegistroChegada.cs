using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class RegistroChegada
    {
        [Key]
        public int IdRegistro { get; set; }

        public int IdAluno { get; set; }

        // Captura o horário real automaticamente
        public DateTime DataHoraChegada { get; set; } = DateTime.Now;

        // True se chegou a partir das 08:00
        public bool EstaAtrasado { get; set; }

        public int MinutosAtraso { get; set; } = 0;

        [ForeignKey("IdAluno")]
        public virtual Aluno? Aluno { get; set; }
    }
}