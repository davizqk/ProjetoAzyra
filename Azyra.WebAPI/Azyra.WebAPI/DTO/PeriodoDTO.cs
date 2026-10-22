namespace Azyra.WebAPI.DTO
{
    public class PeriodoDTO
    {
        public int IdPeriodo { get; set; }
        public string Nome { get; set; } = string.Empty;
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFim { get; set; }
    }
}
