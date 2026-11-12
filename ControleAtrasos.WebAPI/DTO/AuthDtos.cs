using System.ComponentModel.DataAnnotations;

namespace ControleAtrasos.Api.DTO;
public sealed class LoginRequest
{
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required] public string Senha { get; set; } = "";
}
public sealed record LoginResponse(string Token, DateTime ExpiraEmUtc, string Nome, IReadOnlyList<string> Papeis);
