namespace ControleAtrasos.Api.Exceptions;
public sealed class RegraNegocioException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}
