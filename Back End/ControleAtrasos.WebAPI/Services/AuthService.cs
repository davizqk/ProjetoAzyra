using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ControleAtrasos.Api.DTO;
using ControleAtrasos.Api.Exceptions;
using ControleAtrasos.Api.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace ControleAtrasos.Api.Services;
public sealed class AuthService(IUsuarioRepository usuarios, IConfiguration config) : IAuthService
{
    public async Task<LoginResponse> LoginAsync(LoginRequest req, CancellationToken ct)
    {
        var usuario = await usuarios.BuscarPorEmailAsync(req.Email.Trim().ToLowerInvariant(), ct);
        if (usuario is null || !usuario.Ativo || string.IsNullOrEmpty(req.Senha) ||
            !BCrypt.Net.BCrypt.Verify(req.Senha, usuario.SenhaHash))
            throw new RegraNegocioException(401, "E-mail ou senha inválidos.");
        var papeis = await usuarios.PapeisAsync(usuario.IdUsuario, ct);
        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
            new(ClaimTypes.Name, usuario.Nome)
        };
        claims.AddRange(papeis.Select(x => new Claim(ClaimTypes.Role, x)));
        var jwt = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key não configurada.");
        var exp = DateTime.UtcNow.AddHours(2);
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"], claims: claims,
            expires: exp,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt)), SecurityAlgorithms.HmacSha256));
        return new(new JwtSecurityTokenHandler().WriteToken(token), exp, usuario.Nome, papeis);
    }
}
