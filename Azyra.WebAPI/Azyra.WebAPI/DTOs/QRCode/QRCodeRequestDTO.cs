using System.ComponentModel.DataAnnotations;

namespace Azyra.WebAPI.DTOs.QRCode;

public class QRCodeRequestDTO
{
    public int IdTurma { get; set; }
    [Required]
    public string TokenHash { get; set; } = string.Empty;
    public DateTime? GeradoEm { get; set; }
    public DateTime ExpiraEm { get; set; }
    public bool? Ativo { get; set; }
}
