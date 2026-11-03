using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.HistoricoAtraso;

public class HistoricoAtrasoRequestDTO
{
    [Required]
    public string CPF { get; set; } = string.Empty;

    // Opcional para testes; se omitido, a API usa a data/hora atual do servidor.
    public DateTime? DataHoraChegada { get; set; }
}
