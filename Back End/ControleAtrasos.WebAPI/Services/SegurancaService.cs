using System.Security.Cryptography;
using System.Text;
using ControleAtrasos.Api.Interfaces;

namespace ControleAtrasos.Api.Services;
public sealed class SegurancaService : ISegurancaService
{
    private readonly byte[] _chave;
    public SegurancaService(IConfiguration cfg)
    {
        var value = cfg["Security:CpfHmacKey"] ?? "";
        if (Encoding.UTF8.GetByteCount(value) < 32)
            throw new InvalidOperationException("Security:CpfHmacKey precisa de pelo menos 32 bytes. Execute scripts/configurar-dev.ps1.");
        _chave = Encoding.UTF8.GetBytes(value);
    }
    public string NormalizarCpf(string cpf) => new(cpf.Where(char.IsAsciiDigit).ToArray());
    public bool ValidarCpf(string cpf)
    {
        if (cpf.Length != 11 || cpf.All(x => x == cpf[0])) return false;
        for (var k = 9; k <= 10; k++)
        {
            var sum = 0;
            for (var i = 0; i < k; i++) sum += (cpf[i] - '0') * (k + 1 - i);
            var digit = sum * 10 % 11;
            if (digit == 10) digit = 0;
            if (digit != cpf[k] - '0') return false;
        }
        return true;
    }
    public byte[] HashCpf(string cpfNormalizado) => HMACSHA256.HashData(_chave, Encoding.UTF8.GetBytes(cpfNormalizado));
    public string NovoToken() => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
    public byte[] HashToken(string token) => SHA256.HashData(Encoding.UTF8.GetBytes(token.ToUpperInvariant()));
}
