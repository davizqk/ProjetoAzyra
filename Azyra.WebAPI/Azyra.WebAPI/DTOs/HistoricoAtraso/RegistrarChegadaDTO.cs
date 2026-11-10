
using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.HistoricoAtraso;

public class RegistrarChegadaDTO
{
    [Range(1, int.MaxValue)]
    public int IdAluno { get; set; }
}
