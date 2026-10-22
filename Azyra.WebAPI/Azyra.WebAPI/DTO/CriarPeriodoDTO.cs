using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTO
{
    public class CriarPeriodoDTO
    {
        [Required(ErrorMessage = "O nome do período é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A hora de início é obrigatória.")]
        public TimeOnly HoraInicio { get; set; }

        [Required(ErrorMessage = "A hora de fim é obrigatória.")]
        public TimeOnly HoraFim { get; set; }
    }
}
